// lib/db/identity.test.ts
// Exercises the read-only connection report against a real (in-memory) Postgres in each failure mode that can
// make production say `relation "projects" does not exist` while the tables exist somewhere.
import { describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { describeConnection, describeUrl, explain, EXPECTED_TABLES } from './identity'

async function freshDb() {
  const client = new PGlite()
  return { client, db: drizzle(client) }
}

describe('describeConnection', () => {
  it('reports a migrated database as healthy: every table in public, visible and readable', async () => {
    const { db } = await freshDb()
    await migrate(db, { migrationsFolder: 'drizzle' })
    const identity = await describeConnection(db, 'pglite:memory')

    expect(identity.effectiveSchemas).toContain('public')
    expect(identity.tables.map((t) => t.name)).toEqual(EXPECTED_TABLES)
    expect(identity.tables.every((t) => t.schemas.join() === 'public' && t.visible && t.canSelect)).toBe(true)
    expect(explain(identity)).toMatch(/Every table exists/)
  }, 60_000)

  it('spots a database that was never migrated (the wrong database on the right host)', async () => {
    const { db } = await freshDb()
    const identity = await describeConnection(db, 'pglite:memory')
    expect(identity.tables.every((t) => t.schemas.length === 0)).toBe(true)
    expect(explain(identity)).toMatch(/None of the app's tables exist/)
  }, 60_000)

  it('spots tables that exist but sit outside the search_path', async () => {
    const { client, db } = await freshDb()
    await client.exec('CREATE SCHEMA app; SET search_path TO app')
    await migrate(db, { migrationsFolder: 'drizzle' }) // creates the tables in "app"
    await client.exec('SET search_path TO public')

    const identity = await describeConnection(db, 'pglite:memory')
    expect(identity.searchPath).toBe('public')
    expect(identity.tables.find((t) => t.name === 'projects')).toMatchObject({ schemas: ['app'], visible: false })
    expect(explain(identity)).toMatch(/projects \(in schema app\).*not on this role's search_path "public"/)
  }, 60_000)
})

describe('describeUrl', () => {
  it('reports the host, database and pooling, never the user or password', () => {
    const described = describeUrl('postgresql://app_user:s3cret@ep-cool-name-123-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require')
    expect(described).toEqual({ host: 'ep-cool-name-123-pooler.us-east-2.aws.neon.tech', database: 'neondb', pooled: true })
    expect(JSON.stringify(described)).not.toMatch(/s3cret|app_user/)
  })
})
