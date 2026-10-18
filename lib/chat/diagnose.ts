import { ApiError } from '@google/genai'

export type ChatFailureKind =
  | 'authentication'
  | 'permission'
  | 'billing'
  | 'model'
  | 'rate_limit'
  | 'overloaded'
  | 'bad_request'
  | 'server'
  | 'connection'
  | 'timeout'
  | 'runtime'

export interface ChatFailure {
  kind: ChatFailureKind
  status?: number
  /** Gemini's error status, e.g. "RESOURCE_EXHAUSTED". */
  type?: string
  /** Sanitized and truncated; never contains the API key. */
  message: string
  hint: string
}

const HINTS: Record<ChatFailureKind, string> = {
  authentication:
    'GEMINI_API_KEY was rejected. Create a key in Google AI Studio and paste it into Vercel (no quotes or spaces) for the Production environment, then redeploy.',
  permission:
    'The API key is not allowed to call the Gemini API. Check the key’s API restrictions and that the Generative Language API is enabled for its project.',
  billing:
    'The Gemini API needs billing (or is unavailable on the free tier in this region). Enable billing for the key’s project in Google AI Studio.',
  model: 'The model is not available to this API key. Check the model name against the Gemini models list.',
  rate_limit: 'The project hit its Gemini quota or rate limit. Wait, or raise the limits / enable billing in Google AI Studio.',
  overloaded: 'Gemini is temporarily overloaded. Retrying shortly usually succeeds.',
  bad_request: 'Gemini rejected a request parameter. See the message for the parameter name.',
  server: 'Gemini returned a server error. Retry; if it persists, check the Google AI Studio status page.',
  connection: 'The server could not reach the Gemini API (network or DNS failure).',
  timeout: 'The request to Gemini timed out.',
  runtime: 'A failure in the chat route itself, not a Gemini API error.',
}

// Google API keys start with "AIza"; scrub anything that looks like one before logging.
const KEY_PATTERN = /AIza[0-9A-Za-z_-]{20,}/g

function sanitize(text: string): string {
  return text.replace(KEY_PATTERN, '[redacted]').slice(0, 300)
}

/** Gemini errors carry a JSON body ({ error: { code, message, status } }) in their message. */
function parseGeminiError(error: ApiError): { message: string; code?: string } {
  try {
    const body = JSON.parse(error.message) as { error?: { message?: string; status?: string } }
    if (body.error?.message) return { message: body.error.message, code: body.error.status }
  } catch {
    // Not JSON: fall through to the raw message.
  }
  return { message: error.message }
}

function classify(status: number, code: string | undefined, message: string): ChatFailureKind {
  if (status === 401 || code === 'UNAUTHENTICATED' || /API key not valid|API_KEY_INVALID/i.test(message)) {
    return 'authentication'
  }
  if (status === 403 || code === 'PERMISSION_DENIED') return 'permission'
  if (code === 'FAILED_PRECONDITION' || /billing|not available in your country|location is not supported/i.test(message)) {
    return 'billing'
  }
  if (status === 404 || code === 'NOT_FOUND') return 'model'
  if (status === 429 || code === 'RESOURCE_EXHAUSTED') return 'rate_limit'
  if (status === 503 || code === 'UNAVAILABLE' || /overloaded/i.test(message)) return 'overloaded'
  if (status === 504 || code === 'DEADLINE_EXCEEDED') return 'timeout'
  if (status === 400 || code === 'INVALID_ARGUMENT') return 'bad_request'
  return 'server'
}

export function diagnoseChatError(error: unknown): ChatFailure {
  if (error instanceof ApiError) {
    const { message, code } = parseGeminiError(error)
    const kind = classify(error.status, code, message)
    return { kind, status: error.status, type: code, message: sanitize(message), hint: HINTS[kind] }
  }

  const err = error instanceof Error ? error : new Error(String(error))
  // fetch() reports network/DNS failures as a TypeError("fetch failed"); aborts as AbortError/TimeoutError.
  if (err.name === 'TypeError' && /fetch failed|network/i.test(err.message)) {
    return { kind: 'connection', message: sanitize(err.message), hint: HINTS.connection }
  }
  if (err.name === 'AbortError' || err.name === 'TimeoutError') {
    return { kind: 'timeout', message: sanitize(err.message), hint: HINTS.timeout }
  }
  return { kind: 'runtime', message: sanitize(`${err.name}: ${err.message}`), hint: HINTS.runtime }
}

/** The key's shape only (never its value): catches the common "pasted with quotes or a newline" mistake. */
export function describeApiKey(key: string | undefined): 'missing' | 'ok' | 'has-whitespace-or-quotes' | 'unexpected-prefix' {
  if (!key) return 'missing'
  if (/[\s"']/.test(key)) return 'has-whitespace-or-quotes'
  return key.startsWith('AIza') ? 'ok' : 'unexpected-prefix'
}
