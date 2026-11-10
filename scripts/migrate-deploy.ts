import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { bootstrapAdmin } from '@/lib/db/bootstrap-admin'

// Applies the drizzle/ migrations to DATABASE_URL. Runs on Vercel before `next build` (the `vercel-build`
// script), so every deployment's database has the tables its code needs, using Vercel's own DATABASE_URL:
// no connection string ever has to leave Vercel. Migrations only create what is missing (IF NOT EXISTS) and
// each one is recorded in drizzle.__drizzle_migrations, so re-running is a no-op. Logs host and database name only.
// Local databases (pglite:) use `npm run db:local` instead.

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('migrate-deploy: DATABASE_URL is not set, so the database tables cannot be created. Stopping the build.')
    process.exit(1)
  }
  if (url.startsWith('pglite:')) {
    console.log('migrate-deploy: local pglite database; run `npm run db:local` instead. Skipping.')
    return
  }

  const { hostname, pathname } = new URL(url)
  console.log(`migrate-deploy: applying migrations to ${pathname.replace(/^\//, '')} on ${hostname}`)
  const db = drizzle(neon(url))
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('migrate-deploy: database schema is up to date')
  // First admin for a new database, from ADMIN_EMAIL / ADMIN_PASSWORD set in Vercel; existing accounts are untouched.
  console.log(`migrate-deploy: ${await bootstrapAdmin(db, { ADMIN_EMAIL: process.env.ADMIN_EMAIL, ADMIN_PASSWORD: process.env.ADMIN_PASSWORD })}`)
}

main().catch((error) => {
  console.error('migrate-deploy: failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
