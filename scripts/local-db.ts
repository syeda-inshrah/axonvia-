import { migrate } from 'drizzle-orm/pglite/migrator'
import type { PgliteDatabase } from 'drizzle-orm/pglite'
import { db } from '@/lib/db'

// Creates/updates the local PGlite database from drizzle/ migrations.
// Usage: node --env-file=.env.local node_modules/.bin/tsx scripts/local-db.ts
// Refuses to run against anything but a pglite: URL, so it can never touch the shared Neon database.

async function main() {
  if (!process.env.DATABASE_URL?.startsWith('pglite:')) {
    console.error('scripts/local-db.ts only runs against a local DATABASE_URL=pglite:<folder>. Nothing was changed.')
    process.exit(1)
  }
  await migrate(db as unknown as PgliteDatabase, { migrationsFolder: 'drizzle' })
  console.log(`Local database ready at ${process.env.DATABASE_URL.slice('pglite:'.length)}`)
}

main()
