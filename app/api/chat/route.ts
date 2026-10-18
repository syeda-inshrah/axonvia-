import { FinishReason, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai'
import { z } from 'zod'
import { describeApiKey, diagnoseChatError } from '@/lib/chat/diagnose'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { clientIp } from '@/lib/client-ip'
import { getPublishedFaqs } from '@/lib/queries/content'
import { createRateLimiter } from '@/lib/rate-limit'

// Streams can take a few seconds; give the function room on Vercel.
export const maxDuration = 30

// Stable Gemini Flash model (Google's recommended Flash for new projects).
const MODEL = 'gemini-3.8-flash'
// A cost cap, not a target: answers are short; thinking tokens also count toward it.
const MAX_OUTPUT_TOKENS = 2048

// Finish/block reasons that mean Gemini's safety filters stopped the answer.
const BLOCKED: string[] = [
  FinishReason.SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
  FinishReason.RECITATION,
]

const UNAVAILABLE = 'The chat assistant is unavailable right now. Please use the contact form below and we’ll reply by email.'
const DECLINED = 'I can’t help with that here. For anything about working with Axonvia, please use the contact form below.'
const INTERRUPTED = '\n\nSorry, something went wrong while answering. Please try again, or use the contact form below.'
const BUSY = '\n\nThe assistant is busy right now. Please try again in a moment, or use the contact form below.'

// 20 messages per visitor per 10 minutes: plenty for a conversation, a ceiling on API spend.
const limiter = createRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000 })

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1000),
      })
    )
    .min(1)
    .max(20)
    .refine((messages) => messages[0]?.role === 'user' && messages.at(-1)?.role === 'user', {
      message: 'The conversation must start and end with a visitor message.',
    }),
})

function json(status: number, error: string) {
  return Response.json({ error }, { status })
}

export async function POST(request: Request) {
  // Browsers send Origin on cross-site requests; only this site may spend the API budget.
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return json(403, 'Forbidden')

  // Read on the server only; never sent to the browser or logged.
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return json(503, UNAVAILABLE)

  if (!limiter.hit(clientIp(request.headers)).allowed) {
    return json(429, 'You’ve sent a lot of messages. Please wait a few minutes, or use the contact form below.')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, 'Invalid request.')
  }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) return json(400, 'Invalid request.')

  const ai = new GoogleGenAI({ apiKey })
  const systemInstruction = buildSystemPrompt(await getPublishedFaqs())
  // The widget's history uses 'assistant'; Gemini calls that role 'model'.
  const contents: Content[] = parsed.data.messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }))

  const encoder = new TextEncoder()
  const reply = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            // Short website answers don't need deep reasoning; low thinking keeps replies fast and cheap.
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })

        let wroteText = false
        let blocked = false
        for await (const chunk of stream) {
          const text = chunk.text
          if (text) {
            controller.enqueue(encoder.encode(text))
            wroteText = true
          }
          const finishReason = chunk.candidates?.[0]?.finishReason
          if (chunk.promptFeedback?.blockReason || (finishReason && BLOCKED.includes(finishReason))) blocked = true
        }

        if (blocked) controller.enqueue(encoder.encode(wroteText ? `\n\n${DECLINED}` : DECLINED))
      } catch (error) {
        // One JSON line per failure (Vercel → Logs): HTTP status and Gemini error status, plus the key's shape
        // so a mis-pasted key is obvious. Never the key itself, headers, or the visitor's messages.
        const failure = diagnoseChatError(error)
        console.error(
          JSON.stringify({
            event: 'chat_api_error',
            provider: 'gemini',
            ...failure,
            model: MODEL,
            keyFormat: describeApiKey(apiKey),
          })
        )
        const transient = failure.kind === 'overloaded' || failure.kind === 'rate_limit'
        controller.enqueue(encoder.encode(transient ? BUSY : INTERRUPTED))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(reply, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}
