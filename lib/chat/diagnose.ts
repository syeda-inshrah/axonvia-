import Anthropic from '@anthropic-ai/sdk'

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
  /** Anthropic's error type, e.g. "authentication_error". */
  type?: string
  /** Sanitized and truncated; never contains the API key. */
  message: string
  /** Anthropic request id: quote it to Anthropic support to trace the exact request. */
  requestId?: string
  hint: string
}

const HINTS: Record<ChatFailureKind, string> = {
  authentication:
    'ANTHROPIC_API_KEY was rejected. Re-copy the key from console.anthropic.com into Vercel (no quotes or spaces), for the Production environment, then redeploy.',
  permission: 'The API key lacks permission for this request. Check the key’s workspace and its allowed models in the Anthropic Console.',
  billing: 'The Anthropic account has no available credit. Add credits or a payment method under Plans & Billing in the Anthropic Console.',
  model: 'The model is not available to this API key or organization. Check model access in the Anthropic Console.',
  rate_limit: 'The organization hit an Anthropic rate or spend limit. Wait, or raise the limits in the Anthropic Console.',
  overloaded: 'Anthropic is temporarily overloaded. Retrying shortly usually succeeds.',
  bad_request: 'Anthropic rejected a request parameter. See the message for the parameter name.',
  server: 'Anthropic returned a server error. Retry; if it persists, check status.anthropic.com.',
  connection: 'The server could not reach api.anthropic.com (network or DNS failure).',
  timeout: 'The request to Anthropic timed out.',
  runtime: 'A failure in the chat route itself, not an Anthropic API error.',
}

// Anthropic keys start with sk-ant-; scrub anything that looks like one before logging.
const KEY_PATTERN = /sk-ant-[A-Za-z0-9_-]+/g

function sanitize(text: string): string {
  return text.replace(KEY_PATTERN, '[redacted]').slice(0, 300)
}

function instanceOf(error: unknown, cls: unknown): boolean {
  return typeof cls === 'function' && error instanceof cls
}

export function diagnoseChatError(error: unknown): ChatFailure {
  if (instanceOf(error, Anthropic.APIConnectionTimeoutError)) {
    return { kind: 'timeout', message: sanitize(String((error as Error).message)), hint: HINTS.timeout }
  }
  if (instanceOf(error, Anthropic.APIConnectionError)) {
    return { kind: 'connection', message: sanitize(String((error as Error).message)), hint: HINTS.connection }
  }

  if (instanceOf(error, Anthropic.APIError)) {
    const apiError = error as InstanceType<typeof Anthropic.APIError>
    const body = apiError.error as { error?: { type?: string; message?: string }; type?: string } | undefined
    const type = body?.error?.type ?? body?.type
    const message = sanitize(body?.error?.message ?? apiError.message)
    const status = typeof apiError.status === 'number' ? apiError.status : undefined
    const requestId = apiError.requestID ?? undefined

    const kind: ChatFailureKind =
      status === 401 || type === 'authentication_error'
        ? 'authentication'
        : status === 403 || type === 'permission_error'
          ? 'permission'
          : status === 402 || type === 'billing_error' || /credit balance|billing/i.test(message)
            ? 'billing'
            : status === 404 || type === 'not_found_error'
              ? 'model'
              : status === 429 || type === 'rate_limit_error'
                ? 'rate_limit'
                : status === 529 || type === 'overloaded_error'
                  ? 'overloaded'
                  : status === 400 || status === 413 || type === 'invalid_request_error' || type === 'request_too_large'
                    ? 'bad_request'
                    : 'server'

    return { kind, status, type, message, requestId, hint: HINTS[kind] }
  }

  const err = error instanceof Error ? error : new Error(String(error))
  return { kind: 'runtime', message: sanitize(`${err.name}: ${err.message}`), hint: HINTS.runtime }
}

/** The key's shape only (never its value): catches the common "pasted with quotes or a newline" mistake. */
export function describeApiKey(key: string | undefined): 'missing' | 'ok' | 'has-whitespace-or-quotes' | 'unexpected-prefix' {
  if (!key) return 'missing'
  if (/[\s"']/.test(key)) return 'has-whitespace-or-quotes'
  return key.startsWith('sk-ant-') ? 'ok' : 'unexpected-prefix'
}
