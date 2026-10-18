import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { describeApiKey, diagnoseChatError } from '@/lib/chat/diagnose'
import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { clientIp } from '@/lib/client-ip'
import { getPublishedFaqs } from '@/lib/queries/content'
import { createRateLimiter } from '@/lib/rate-limit'

// Streams can take a few seconds; give the function room on Vercel.
export const maxDuration = 30

const MODEL = 'claude-opus-5-5'
// A cost cap, not a target: answers are short, and this leaves room for the model's (always-on) thinking.
const MAX_TOKENS = 4096

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

  if (!process.env.ANTHROPIC_API_KEY) return json(503, UNAVAILABLE)

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

  const client = new Anthropic()
  const system = buildSystemPrompt(await getPublishedFaqs())

  const encoder = new TextEncoder()
  const reply = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          // Low effort suits short website answers; Opus 5.5 defaults to medium.
          output_config: { effort: 'low' },
          // If a safety classifier declines, retry on Anthropic's recommended fallback model server-side.
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          system,
          messages: parsed.data.messages,
        })

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }

        const message = await stream.finalMessage()
        if (message.stop_reason === 'refusal') controller.enqueue(encoder.encode(DECLINED))
      } catch (error) {
        // One JSON line per failure (Vercel → Logs): status, Anthropic error type and request id, plus the
        // key's shape so a mis-pasted key is obvious. Never the key itself, headers, or the visitor's messages.
        const failure = diagnoseChatError(error)
        console.error(
          JSON.stringify({
            event: 'chat_api_error',
            ...failure,
            model: MODEL,
            keyFormat: describeApiKey(process.env.ANTHROPIC_API_KEY),
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
