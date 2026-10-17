import { verifyAdminCredentials } from '@/lib/auth-credentials'
import { createRateLimiter } from '@/lib/rate-limit'

const FIFTEEN_MINUTES = 15 * 60 * 1000

/** Failed sign-ins: 5 per account and 20 per IP in any 15-minute window. */
export function createLoginThrottle() {
  const byAccount = createRateLimiter({ limit: 5, windowMs: FIFTEEN_MINUTES })
  const byIp = createRateLimiter({ limit: 20, windowMs: FIFTEEN_MINUTES })
  const account = (email: string) => email.trim().toLowerCase()

  return {
    isBlocked(ip: string, email: string) {
      return byAccount.isBlocked(account(email)) || byIp.isBlocked(ip)
    },
    recordFailure(ip: string, email: string) {
      byAccount.hit(account(email))
      byIp.hit(ip)
    },
    clear(email: string) {
      byAccount.reset(account(email))
    },
  }
}

export type LoginThrottle = ReturnType<typeof createLoginThrottle>

export const loginThrottle = createLoginThrottle()

/**
 * Credentials check behind every sign-in path (the login form and a direct POST to the Auth.js callback),
 * so the lockout can't be bypassed by skipping the form.
 */
export async function authorizeAdminLogin(
  { email, password }: { email: string; password: string },
  ip: string,
  throttle: LoginThrottle = loginThrottle
) {
  if (throttle.isBlocked(ip, email)) return null

  const user = await verifyAdminCredentials(email, password)
  if (!user) {
    throttle.recordFailure(ip, email)
    return null
  }

  throttle.clear(email)
  return user
}
