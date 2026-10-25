import { FinishReason, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai'
import { z } from 'zod'
import { describeApiKey, diagnoseChatError } from '@/lib/chat/diagnose'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { clientIp } from '@/lib/client-ip'
import { getPublishedFaqs } from '@/lib/queries/content'
import { withCoreFaqs } from '@/lib/faq-content'
import { createRateLimiter } from '@/lib/rate-limit'

// Streams can take a few seconds; give the function room on Vercel.
// Gemini can be slow under load; 60s is the most Vercel's Hobby plan allows. Replies stay inside REPLY_DEADLINE_MS.
export const maxDuration = 60

// Gemini Flash model. gemini-3.8-flash and gemini-3.7-flash stopped answering this project's key (Oct 2026), while
// gemini-3.5-flash answers in about a second; re-test before switching back.
const MODEL = 'gemini-3.5-flash'
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

// Gemini's "high demand" 503s are usually gone within a second or two. Before any text has been sent, an
// overloaded attempt is retried after these pauses; quota and other errors are not, since retrying can't help.
const OVERLOAD_RETRY_DELAYS_MS = [500, 1200]

// The whole reply, retries included, must finish inside this budget (well under maxDuration), so a slow Gemini
// ends in the friendly BUSY message rather than the platform's timeout page. Overridable for operations/tests.
const DEFAULT_REPLY_DEADLINE_MS = 45_000
const replyDeadlineMs = () => Number(process.env.CHAT_REPLY_DEADLINE_MS) || DEFAULT_REPLY_DEADLINE_MS
const TOO_SLOW = '\n\nSorry, that took too long to finish. Please try again, or use the contact form below.'

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
  const systemInstruction = buildSystemPrompt(withCoreFaqs(await getPublishedFaqs()))
  // The widget's history uses 'assistant'; Gemini calls that role 'model'.
  const contents: Content[] = parsed.data.messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }))

  const encoder = new TextEncoder()
  // Set when the visitor disconnects (closes the chat or the tab): stop pulling tokens from Gemini, and don't
  // treat the closed stream as a failure.
  let disconnected = false
  const reply = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false
      const deadline = new AbortController()
      const timer = setTimeout(() => deadline.abort(), replyDeadlineMs())
      try {
        for (let attempt = 0; ; attempt++) {
          try {
            const stream = await ai.models.generateContentStream({
              model: MODEL,
              contents,
              config: {
                systemInstruction,
                maxOutputTokens: MAX_OUTPUT_TOKENS,
                // Short website answers don't need deep reasoning; low thinking keeps replies fast and cheap.
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
                abortSignal: deadline.signal,
              },
            })

            let blocked = false
            for await (const chunk of stream) {
              if (disconnected) return
              if (deadline.signal.aborted) throw new Error('reply deadline')
              const text = chunk.text
              if (text) {
                controller.enqueue(encoder.encode(text))
                wroteText = true
              }
              const finishReason = chunk.candidates?.[0]?.finishReason
              if (chunk.promptFeedback?.blockReason || (finishReason && BLOCKED.includes(finishReason))) blocked = true
            }

            if (blocked) controller.enqueue(encoder.encode(wroteText ? `\n\n${DECLINED}` : DECLINED))
            return
          } catch (error) {
            const retryable =
              !wroteText && !deadline.signal.aborted && attempt < OVERLOAD_RETRY_DELAYS_MS.length && diagnoseChatError(error).kind === 'overloaded'
            if (!retryable || disconnected) throw error
            await new Promise((resolve) => setTimeout(resolve, OVERLOAD_RETRY_DELAYS_MS[attempt]))
          }
        }
      } catch (error) {
        if (disconnected) return
        if (deadline.signal.aborted) {
          console.error(JSON.stringify({ event: 'chat_api_error', provider: 'gemini', kind: 'timeout', model: MODEL, deadlineMs: replyDeadlineMs(), partial: wroteText }))
          controller.enqueue(encoder.encode(wroteText ? TOO_SLOW : BUSY))
          return
        }
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
        clearTimeout(timer)
        if (!disconnected) controller.close()
      }
    },
    cancel() {
      disconnected = true
    },
  })

  return new Response(reply, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}
