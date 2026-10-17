// auth.test.ts
import { describe, expect, it, vi } from 'vitest'

const NextAuth = vi.fn(() => ({ handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() }))
vi.mock('next-auth', () => ({ default: NextAuth }))
vi.mock('next-auth/providers/credentials', () => ({ default: (config: unknown) => config }))
vi.mock('@/lib/admin-login', () => ({ authorizeAdminLogin: vi.fn() }))

describe('Auth.js config', () => {
  it('expires admin sessions after 8 hours instead of the 30-day default', async () => {
    await import('./auth')
    const config = (NextAuth.mock.calls[0] as unknown as [{ session: { maxAge: number } }])[0]
    expect(config.session.maxAge).toBe(8 * 60 * 60)
  })
})
