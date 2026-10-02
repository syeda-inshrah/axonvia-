import { describe, it, expect, vi, beforeEach } from 'vitest'

const neonClient = { mocked: 'neon-client' }
const neon = vi.fn(() => neonClient)
vi.mock('@neondatabase/serverless', () => ({ neon }))

const drizzleInstance = { mocked: 'drizzle-instance' }
const drizzle = vi.fn(() => drizzleInstance)
vi.mock('drizzle-orm/neon-http', () => ({ drizzle }))

describe('db client', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
    neon.mockClear()
    drizzle.mockClear()
  })

  it('creates a Neon client from DATABASE_URL and wraps it with drizzle', async () => {
    vi.resetModules()
    const { db } = await import('./index')

    expect(neon).toHaveBeenCalledWith('postgresql://user:pass@host/db')
    expect(drizzle).toHaveBeenCalledWith(neonClient, expect.any(Object))
    expect(db).toBe(drizzleInstance)
  })
})
