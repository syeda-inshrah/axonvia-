// lib/db/bootstrap-admin.test.ts
import { describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { adminUsers } from './schema'
import { bootstrapAdmin } from './bootstrap-admin'

async function freshDb() {
  const db = drizzle(new PGlite())
  await migrate(db, { migrationsFolder: 'drizzle' })
  return db
}

const PASSWORD = 'a-long-enough-password'

describe('bootstrapAdmin', () => {
  it('does nothing unless both ADMIN_EMAIL and ADMIN_PASSWORD are set', async () => {
    const db = await freshDb()
    expect(await bootstrapAdmin(db, { ADMIN_EMAIL: 'owner@example.com' })).toMatch(/skipped/)
    expect(await db.select().from(adminUsers)).toHaveLength(0)
  }, 60_000)

  it('creates the admin with a hashed password, and never puts the password in the log line', async () => {
    const db = await freshDb()
    const log = await bootstrapAdmin(db, { ADMIN_EMAIL: ' owner@example.com ', ADMIN_PASSWORD: PASSWORD })
    const [admin] = await db.select().from(adminUsers)

    expect(admin.email).toBe('owner@example.com')
    expect(await bcrypt.compare(PASSWORD, admin.passwordHash)).toBe(true)
    expect(log).toMatch(/created admin owner@example.com/)
    expect(log).not.toContain(PASSWORD)
  }, 60_000)

  it('leaves an existing admin and their password untouched on later deploys', async () => {
    const db = await freshDb()
    await bootstrapAdmin(db, { ADMIN_EMAIL: 'owner@example.com', ADMIN_PASSWORD: PASSWORD })
    const log = await bootstrapAdmin(db, { ADMIN_EMAIL: 'owner@example.com', ADMIN_PASSWORD: 'a-different-password!' })
    const admins = await db.select().from(adminUsers)

    expect(log).toMatch(/already exists/)
    expect(admins).toHaveLength(1)
    expect(await bcrypt.compare(PASSWORD, admins[0].passwordHash)).toBe(true)
  }, 60_000)

  it('refuses a password shorter than 12 characters', async () => {
    const db = await freshDb()
    expect(await bootstrapAdmin(db, { ADMIN_EMAIL: 'owner@example.com', ADMIN_PASSWORD: 'short' })).toMatch(/at least 12/)
    expect(await db.select().from(adminUsers)).toHaveLength(0)
  }, 60_000)
})
