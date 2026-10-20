import { readFileSync } from 'fs'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { describeConnection, explain } from '@/lib/db/identity'

// Read-only report on DATABASE_URL: which database, role and search_path the connection uses, where each
// table the code queries lives, and which drizzle/ migrations the database has recorded. SELECTs only, so it
// is safe against production. Compare it with the `db_connection_identity` line the app logs on Vercel.
// Usage: DATABASE_URL=<connection string> npm run db:status

type Rows<T> = { rows: T[] }

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Nothing was checked.')
    process.exit(1)
  }

  const identity = await describeConnection(db)
  const journal = JSON.parse(readFileSync('drizzle/meta/_journal.json', 'utf8')) as { entries: { tag: string; when: number }[] }

  const registry = (await db.execute(
    sql`select to_regclass('drizzle.__drizzle_migrations') is not null as exists`
  )) as unknown as Rows<{ exists: boolean }>
  let recorded: number[] = []
  if (registry.rows[0]?.exists) {
    const applied = (await db.execute(
      sql`select created_at from drizzle.__drizzle_migrations order by created_at`
    )) as unknown as Rows<{ created_at: string | number }>
    recorded = applied.rows.map((row) => Number(row.created_at))
  }
  const lastRecorded = recorded.length ? Math.max(...recorded) : 0
  const pending = journal.entries.filter((entry) => entry.when > lastRecorded).map((entry) => entry.tag)

  console.log('Connection (credentials hidden):')
  console.log(`  host         ${identity.host}${identity.pooled ? '  (pooled)' : ''}`)
  console.log(`  database     ${identity.database}`)
  console.log(`  role         ${identity.role}`)
  console.log(`  search_path  ${identity.searchPath}  →  schemas in effect: ${identity.effectiveSchemas.join(', ') || '(none)'}`)

  console.log('\nTables the app queries:')
  for (const table of identity.tables) {
    const where = table.schemas.length ? `in ${table.schemas.join(', ')}` : 'does not exist'
    const status = !table.schemas.length ? '✗ MISSING' : !table.visible ? '✗ NOT ON search_path' : !table.canSelect ? '✗ NO SELECT' : '✓'
    console.log(`  ${status.padEnd(21)} ${table.name.padEnd(24)} ${where}`)
  }
  console.log(`\nMigrations recorded: ${recorded.length} of ${journal.entries.length}${pending.length ? ` (pending: ${pending.join(', ')})` : ''}`)

  const healthy = identity.tables.every((table) => table.visible && table.canSelect)
  console.log(`\nVerdict: ${explain(identity)}`)
  if (healthy && pending.length === 0) console.log('  Up to date.')
  else if (pending.length > 0 && identity.tables.every((table) => table.schemas.length === 0 || table.visible))
    console.log(`  To fix: run \`npm run db:migrate\` against this exact DATABASE_URL (applies ${pending.join(', ')}; only CREATE TABLE IF NOT EXISTS).`)

  process.exit(healthy && pending.length === 0 ? 0 : 2)
}

main().catch((error) => {
  console.error('db:status could not read the database:', error instanceof Error ? error.message.replace(/postgres(ql)?:\/\/\S+/gi, 'postgres://[redacted]') : error)
  process.exit(1)
})
