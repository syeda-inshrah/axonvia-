import { createRateLimiter } from '@/lib/rate-limit'

/** Hidden field real visitors never see or fill in; bots that auto-fill every input do. */
export const HONEYPOT_FIELD = 'website'
/** Set by the form when it mounts, so the server can spot instant (scripted) submissions. */
export const STARTED_AT_FIELD = 'startedAt'

const MIN_FILL_MS = 2000
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

export function looksAutomated(formData: FormData, now = Date.now()): boolean {
  const honeypot = formData.get(HONEYPOT_FIELD)
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return true

  const startedAt = Number(formData.get(STARTED_AT_FIELD))
  return Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < MIN_FILL_MS
}

// Per-IP caps stop floods; per-recipient caps stop the forms being used to email someone else repeatedly.
const limits = {
  contact: {
    perIp: createRateLimiter({ limit: 5, windowMs: HOUR }),
    perRecipient: createRateLimiter({ limit: 3, windowMs: DAY }),
  },
  newsletter: {
    perIp: createRateLimiter({ limit: 10, windowMs: HOUR }),
    perRecipient: createRateLimiter({ limit: 3, windowMs: DAY }),
  },
}

/** Records the submission and reports whether it is within both limits. */
export function allowSubmission(form: keyof typeof limits, ip: string, email: string): boolean {
  const ipAllowed = limits[form].perIp.hit(ip).allowed
  const recipientAllowed = limits[form].perRecipient.hit(email.trim().toLowerCase()).allowed
  return ipAllowed && recipientAllowed
}
