// @vitest-environment node
// lib/db/local.test.ts
import { describe, expect, it, vi } from 'vitest'
import { sql } from 'drizzle-orm'

// PGlite boots a WebAssembly Postgres; the first start is slow on a cold disk.
describe('local database mode', { timeout: 60_000 }, () => {
  it('uses an embedded PGlite database when DATABASE_URL starts with pglite: (local development only)', async () => {
    vi.resetModules()
    vi.stubEnv('DATABASE_URL', 'pglite:memory://')
    const { db } = await import('./index')

    const result = (await db.execute(sql`select 1 + 1 as n`)) as unknown as { rows: { n: number }[] }
    expect(result.rows[0].n).toBe(2)
    vi.unstubAllEnvs()
  })

  it('reuses one database per process, so the proxy and the app never open the same data folder twice', async () => {
    vi.stubEnv('DATABASE_URL', 'pglite:memory://')
    const g = globalThis as { __axonviaLocalDb?: unknown }
    vi.resetModules()
    await (await import('./index')).db.execute(sql`select 1`)
    const opened = g.__axonviaLocalDb
    vi.resetModules()
    await (await import('./index')).db.execute(sql`select 1`)
    expect(g.__axonviaLocalDb).toBe(opened)
    vi.unstubAllEnvs()
  })

  it('does not open the database just by being imported (build workers import it in parallel)', async () => {
    const g = globalThis as { __axonviaLocalDb?: unknown }
    delete g.__axonviaLocalDb
    vi.stubEnv('DATABASE_URL', 'pglite:memory://')
    vi.resetModules()
    const { db } = await import('./index')
    expect(g.__axonviaLocalDb).toBeUndefined()

    await db.execute(sql`select 1`)
    expect(g.__axonviaLocalDb).toBeDefined()
    vi.unstubAllEnvs()
  })
})
