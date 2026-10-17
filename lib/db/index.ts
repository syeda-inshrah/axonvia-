import { createRequire } from 'module'
import path from 'path'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type Database = ReturnType<typeof drizzle<typeof schema>>

// DATABASE_URL=pglite:<folder> runs an embedded Postgres (PGlite) for local development and testing, so the
// full app works without touching the shared Neon database. Production uses a normal Neon connection string.
const LOCAL_PREFIX = 'pglite:'

const globalForDb = globalThis as typeof globalThis & { __axonviaLocalDb?: Database }

function createLocalDb(dataDir: string): Database {
  // One instance per process: the proxy and the app routes both import this module, and two PGlite
  // instances on the same folder would corrupt it.
  if (globalForDb.__axonviaLocalDb) return globalForDb.__axonviaLocalDb

  // Resolved at runtime rather than bundled: @electric-sql/pglite is a dev dependency used only locally.
  const load = createRequire(path.join(process.cwd(), 'package.json'))
  const { PGlite } = load('@electric-sql/pglite')
  const { drizzle: drizzlePglite } = load('drizzle-orm/pglite')

  globalForDb.__axonviaLocalDb = drizzlePglite(new PGlite(dataDir), { schema }) as Database
  return globalForDb.__axonviaLocalDb
}

function createDb(): Database {
  const url = process.env.DATABASE_URL
  if (url?.startsWith(LOCAL_PREFIX)) {
    // Opened on first use, not at import: `next build` imports this module in several workers at once,
    // and opening the same PGlite folder concurrently corrupts it.
    const dataDir = url.slice(LOCAL_PREFIX.length)
    return new Proxy({} as Database, {
      get(_, property) {
        const real = createLocalDb(dataDir)
        const value = Reflect.get(real, property)
        return typeof value === 'function' ? value.bind(real) : value
      },
    })
  }
  return drizzle(neon(url!), { schema })
}

export const db = createDb()
