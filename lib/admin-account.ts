import { z } from 'zod'

export const MIN_ADMIN_PASSWORD_LENGTH = 12

/** Returns a human-readable problem with a new admin account, or null if it is acceptable. */
export function validateNewAdmin(email: string, password: string): string | null {
  if (!z.string().trim().email().safeParse(email).success) return 'Provide a valid email address.'
  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`
  }
  if (password.length > 128) return 'Password must be at most 128 characters.'
  return null
}
