import { describe, it, expect, vi, beforeEach } from 'vitest'

const auth = vi.fn()
vi.mock('@/auth', () => ({ auth }))

describe('requireAdminUser', () => {
  beforeEach(() => auth.mockReset())

  it('returns the user when a session exists', async () => {
    auth.mockResolvedValue({ user: { id: 'u1', email: 'admin@axonvia.example' } })
    const { requireAdminUser } = await import('./require-admin')

    await expect(requireAdminUser()).resolves.toEqual({ id: 'u1', email: 'admin@axonvia.example' })
  })

  it('throws when there is no session', async () => {
    auth.mockResolvedValue(null)
    const { requireAdminUser } = await import('./require-admin')

    await expect(requireAdminUser()).rejects.toThrow('UNAUTHENTICATED')
  })
})
