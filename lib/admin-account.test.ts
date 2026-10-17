// lib/admin-account.test.ts
import { describe, expect, it } from 'vitest'
import { validateNewAdmin } from './admin-account'

describe('validateNewAdmin', () => {
  it('accepts a valid email and a long password', () => {
    expect(validateNewAdmin('owner@axonvia.example', 'correct-horse-battery')).toBeNull()
  })

  it('rejects a missing or malformed email', () => {
    expect(validateNewAdmin('', 'correct-horse-battery')).toMatch(/email/i)
    expect(validateNewAdmin('not-an-email', 'correct-horse-battery')).toMatch(/email/i)
  })

  it('requires at least 12 characters of password', () => {
    expect(validateNewAdmin('owner@axonvia.example', 'short-pass1')).toMatch(/12 characters/)
  })
})
