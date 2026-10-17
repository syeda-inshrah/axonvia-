import { createHmac, timingSafeEqual } from 'crypto'
import { siteConfig } from '@/lib/site'

// Signed with AUTH_SECRET so only links Axonvia sent can unsubscribe an address.
function sign(email: string, secret: string): string {
  return createHmac('sha256', secret).update(`newsletter-unsubscribe:${email.trim().toLowerCase()}`).digest('base64url')
}

export function unsubscribeToken(email: string): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is required to sign unsubscribe links')
  return sign(email, secret)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const secret = process.env.AUTH_SECRET
  if (!secret || !token) return false
  const expected = Buffer.from(sign(email, secret))
  const given = Buffer.from(token)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({ email, token: unsubscribeToken(email) })
  return `${siteConfig.url}/newsletter/unsubscribe?${params}`
}
