// Classifies a failed database query so the log says what is wrong and what to do, without leaking connection
// strings or row data. Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

export type DbFailureKind = 'missing_table' | 'unavailable' | 'other'

export type DbFailure = { kind: DbFailureKind; code?: string; message: string; hint: string }

const HINTS: Record<DbFailureKind, string> = {
  missing_table:
    'The database schema is behind the code. Apply the migrations to this DATABASE_URL: run `npm run db:status`, then `npm run db:migrate` (see docs/VERCEL.md).',
  unavailable: 'The database could not be reached. This is usually temporary; check the Neon status and DATABASE_URL.',
  other: 'Unexpected database error; see message.',
}

// Errors may arrive directly from the driver (NeonDbError, PGlite) or wrapped by Drizzle (`cause`).
function unwrap(error: unknown): { code?: string; message: string } {
  for (let current: unknown = error, depth = 0; current && depth < 4; depth++) {
    const candidate = current as { code?: unknown; message?: unknown; cause?: unknown }
    if (typeof candidate.code === 'string') return { code: candidate.code, message: String(candidate.message ?? '') }
    if (!candidate.cause) return { message: String(candidate.message ?? error) }
    current = candidate.cause
  }
  return { message: String((error as { message?: unknown })?.message ?? error) }
}

export function diagnoseDbError(error: unknown): DbFailure {
  const { code, message } = unwrap(error)
  // Credentials can appear in some driver messages; never log them.
  const safeMessage = message.replace(/postgres(ql)?:\/\/[^\s'"]+/gi, 'postgres://[redacted]').slice(0, 300)

  let kind: DbFailureKind = 'other'
  if (code === '42P01' || /relation "[^"]+" does not exist/i.test(message)) kind = 'missing_table'
  else if (
    (code && /^(08|57P0|53)/.test(code)) ||
    /fetch failed|ECONNREFUSED|ECONNRESET|ENOTFOUND|ETIMEDOUT|getaddrinfo|timeout|socket hang up/i.test(message)
  )
    kind = 'unavailable'

  return { kind, ...(code ? { code } : {}), message: safeMessage, hint: HINTS[kind] }
}
