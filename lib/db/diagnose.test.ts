// lib/db/diagnose.test.ts
import { describe, expect, it } from 'vitest'
import { diagnoseDbError } from './diagnose'

function pgError(code: string, message: string) {
  return Object.assign(new Error(message), { code })
}

describe('diagnoseDbError', () => {
  it('recognises a missing table and points at the migration commands', () => {
    const failure = diagnoseDbError(pgError('42P01', 'relation "testimonials" does not exist'))
    expect(failure).toMatchObject({ kind: 'missing_table', code: '42P01' })
    expect(failure.hint).toMatch(/npm run db:migrate/)
  })

  it('looks through Drizzle’s wrapper to the driver error', () => {
    const wrapped = Object.assign(new Error('Failed query: select ... from "testimonials"'), {
      cause: pgError('42P01', 'relation "testimonials" does not exist'),
    })
    expect(diagnoseDbError(wrapped).kind).toBe('missing_table')
  })

  it('treats network failures as the database being unavailable, not a schema problem', () => {
    expect(diagnoseDbError(new TypeError('fetch failed')).kind).toBe('unavailable')
    expect(diagnoseDbError(pgError('57P01', 'terminating connection due to administrator command')).kind).toBe('unavailable')
  })

  it('never logs a connection string', () => {
    const failure = diagnoseDbError(new Error('could not connect to postgresql://user:secret@host.neon.tech/db'))
    expect(failure.message).not.toContain('secret')
    expect(failure.message).toContain('postgres://[redacted]')
  })
})
