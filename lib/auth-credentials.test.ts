import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'

const limit = vi.fn()
const where = vi.fn<(condition: SQL) => { limit: typeof limit }>(() => ({ limit }))
const from = vi.fn(() => ({ where }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

const compare = vi.fn()
vi.mock('bcryptjs', () => ({ default: { compare } }))

describe('verifyAdminCredentials', () => {
  beforeEach(() => {
    limit.mockReset()
    where.mockClear()
    compare.mockReset()
  })

  it('matches the email regardless of letter case and surrounding spaces', async () => {
    limit.mockResolvedValue([])
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await verifyAdminCredentials('  Admin@Axonvia.Example ', 'pw')
    const query = new PgDialect().sqlToQuery(where.mock.calls[0][0])
    expect(query.sql).toMatch(/lower\(/)
    expect(query.params).toEqual(['admin@axonvia.example'])
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

  it('still runs a password comparison when no user matches, so response time does not reveal which emails exist', async () => {
    limit.mockResolvedValue([])
    compare.mockResolvedValue(false)
    const { verifyAdminCredentials } = await import('./auth-credentials')

    await verifyAdminCredentials('nobody@axonvia.example', 'pw')
    expect(compare).toHaveBeenCalledTimes(1)
  })
})
