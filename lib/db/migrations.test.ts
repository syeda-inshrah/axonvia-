// lib/db/migrations.test.ts
// Runs the real drizzle/ migrations against an in-memory Postgres (PGlite), the same way `npm run db:migrate`
// applies them, to prove they are safe for every state a database can be in.
import { describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { getTableConfig } from 'drizzle-orm/pg-core'
import * as schema from './schema'

const EXPECTED = Object.values(schema).map((table) => getTableConfig(table as never).name).sort()

async function tables(client: PGlite) {
  const { rows } = await client.query<{ table_name: string }>(
    "select table_name from information_schema.tables where table_schema = 'public' order by 1"
  )
  return rows.map((row) => row.table_name)
}

describe('drizzle migrations', () => {
  it('create every table in the schema on a fresh database', async () => {
    const client = new PGlite()
    await migrate(drizzle(client), { migrationsFolder: 'drizzle' })
    expect(await tables(client)).toEqual(EXPECTED)
    expect(EXPECTED).toContain('testimonials')
  }, 60_000)

  it('fill in missing tables on a database whose tables were created outside the migrations, keeping its data', async () => {
    const client = new PGlite()
    // Some tables exist (e.g. created by hand), but no migration has been recorded.
    await client.exec(`
      CREATE TABLE "admin_users" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "email" text NOT NULL,
        "password_hash" text NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "admin_users_email_unique" UNIQUE("email"));
      INSERT INTO "admin_users" ("email", "password_hash") VALUES ('owner@example.com', 'hash');
      CREATE TABLE "leads" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "name" text NOT NULL,
        "email" text NOT NULL, "company" text, "message" text, "source" text DEFAULT 'contact_form' NOT NULL,
        "status" text DEFAULT 'new' NOT NULL, "created_at" timestamp with time zone DEFAULT now() NOT NULL);
    `)

    await migrate(drizzle(client), { migrationsFolder: 'drizzle' })

    expect(await tables(client)).toEqual(EXPECTED)
    const { rows } = await client.query<{ email: string }>('select email from admin_users')
    expect(rows).toEqual([{ email: 'owner@example.com' }])
  }, 60_000)

  it('do nothing on a database that is already up to date', async () => {
    const client = new PGlite()
    await migrate(drizzle(client), { migrationsFolder: 'drizzle' })
    await client.exec(`INSERT INTO "testimonials" ("quote", "client_name") VALUES ('Great', 'Jane')`)

    await migrate(drizzle(client), { migrationsFolder: 'drizzle' })

    const { rows } = await client.query<{ count: number }>('select count(*)::int as count from testimonials')
    expect(rows[0].count).toBe(1)
  }, 60_000)
})
