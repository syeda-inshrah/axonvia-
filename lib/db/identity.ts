import { sql, type SQL } from 'drizzle-orm'
import { getTableConfig, type PgTable } from 'drizzle-orm/pg-core'
import * as schema from '@/lib/db/schema'

// Read-only description of what a database connection actually sees: which database and role it is, its
// search_path, and where each table the code queries lives. Used by `npm run db:status` and logged by the app
// when a query hits a missing table, so the two can be compared. It never includes passwords or full URLs.

export const EXPECTED_TABLES = Object.values(schema)
  .map((table) => getTableConfig(table as PgTable).name)
  .sort()

export type TableLocation = {
  name: string
  /** Schemas the table exists in (any schema, seen through pg_catalog, regardless of privileges). */
  schemas: string[]
  /** Whether an unqualified `select ... from name` resolves, i.e. it is on this connection's search_path. */
  visible: boolean
  /** Whether this role may read it (where it is visible). */
  canSelect: boolean
}

export type ConnectionIdentity = {
  host: string
  database: string
  pooled: boolean
  role: string
  searchPath: string
  effectiveSchemas: string[]
  tables: TableLocation[]
}

type Executor = { execute: (query: SQL) => Promise<unknown> }

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] }).rows ?? (result as T[])) as T[]
}

/** Host and database name from DATABASE_URL, never the user or password. */
export function describeUrl(url: string | undefined): { host: string; database: string; pooled: boolean } {
  if (!url) return { host: '(DATABASE_URL not set)', database: '', pooled: false }
  if (url.startsWith('pglite:')) return { host: 'local PGlite', database: url.slice('pglite:'.length), pooled: false }
  try {
    const parsed = new URL(url)
    return { host: parsed.hostname, database: parsed.pathname.replace(/^\//, ''), pooled: parsed.hostname.includes('-pooler') }
  } catch {
    return { host: '(unparseable DATABASE_URL)', database: '', pooled: false }
  }
}

export async function describeConnection(db: Executor, url = process.env.DATABASE_URL): Promise<ConnectionIdentity> {
  const [who] = rowsOf<{ database: string; role: string; search_path: string; schemas: string[] | string }>(
    await db.execute(
      sql`select current_database() as database, current_user as role, current_setting('search_path') as search_path, current_schemas(false) as schemas`
    )
  )
  const names = sql.join(
    EXPECTED_TABLES.map((name) => sql`${name}`),
    sql`, `
  )
  const located = rowsOf<{ name: string; schema: string; visible: boolean; can_select: boolean }>(
    await db.execute(sql`
      select c.relname as name, n.nspname as schema, pg_table_is_visible(c.oid) as visible,
             (has_schema_privilege(n.oid, 'USAGE') and has_table_privilege(c.oid, 'SELECT')) as can_select
      from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where c.relkind in ('r', 'p') and c.relname in (${names})
    `)
  )

  // Postgres arrays may come back as a JS array or as the text form "{a,b}" depending on the driver.
  const schemas = Array.isArray(who.schemas) ? who.schemas : String(who.schemas).replace(/[{}"]/g, '').split(',').filter(Boolean)

  return {
    ...describeUrl(url),
    database: who.database,
    role: who.role,
    searchPath: who.search_path,
    effectiveSchemas: schemas,
    tables: EXPECTED_TABLES.map((name) => {
      const matches = located.filter((row) => row.name === name)
      const visible = matches.find((row) => row.visible)
      return {
        name,
        schemas: matches.map((row) => row.schema).sort(),
        visible: Boolean(visible),
        canSelect: Boolean(visible?.can_select),
      }
    }),
  }
}

/** One-line explanation of why the app can't read a table, from what the connection sees. */
export function explain(identity: ConnectionIdentity): string {
  const missing = identity.tables.filter((table) => table.schemas.length === 0).map((table) => table.name)
  const offPath = identity.tables.filter((table) => table.schemas.length > 0 && !table.visible)
  const noAccess = identity.tables.filter((table) => table.visible && !table.canSelect).map((table) => table.name)

  if (missing.length === EXPECTED_TABLES.length)
    return `None of the app's tables exist in database "${identity.database}" on ${identity.host}: this is not the database that was migrated, or it was never migrated.`
  if (missing.length) return `Missing in database "${identity.database}": ${missing.join(', ')}. Apply the migrations to this exact DATABASE_URL.`
  if (offPath.length)
    return `${offPath.map((t) => `${t.name} (in schema ${t.schemas.join('/')})`).join(', ')} exist but are not on this role's search_path "${identity.searchPath}".`
  if (noAccess.length) return `Role "${identity.role}" cannot read: ${noAccess.join(', ')}.`
  return 'Every table exists, is on the search_path, and is readable by this role.'
}
