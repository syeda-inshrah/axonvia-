import { describe, it, expect, vi, beforeEach } from 'vitest'

const limit = vi.fn()
const where = vi.fn(() => ({ limit }))
const from = vi.fn(() => ({ where }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

const compare = vi.fn()
vi.mock('bcryptjs', () => ({ default: { compare } }))

describe('verifyAdminCredentials', () => {
  beforeEach(() => {
    limit.mockReset()
    compare.mockReset()
  })

  it('returns null when no user matches the email', async () => {
    limit.mockResolvedValue([])
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('nobody@axonvia.example', 'pw')).resolves.toBeNull()
  })

  it('returns null when the password does not match', async () => {
    limit.mockResolvedValue([{ id: 'u1', email: 'admin@axonvia.example', passwordHash: 'hash' }])
    compare.mockResolvedValue(false)
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('admin@axonvia.example', 'wrong')).resolves.toBeNull()
  })

  it('returns the user when the password matches', async () => {
    limit.mockResolvedValue([{ id: 'u1', email: 'admin@axonvia.example', passwordHash: 'hash' }])
    compare.mockResolvedValue(true)
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await expect(verifyAdminCredentials('admin@axonvia.example', 'right')).resolves.toEqual({
      id: 'u1',
      email: 'admin@axonvia.example',
    })
  })
})
