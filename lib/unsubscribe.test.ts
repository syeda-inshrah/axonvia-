// lib/unsubscribe.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { unsubscribeToken, unsubscribeUrl, verifyUnsubscribeToken } from './unsubscribe'

describe('newsletter unsubscribe tokens', () => {
  beforeEach(() => vi.stubEnv('AUTH_SECRET', 'test-secret'))
  afterEach(() => vi.unstubAllEnvs())

  it('verifies a token made for the same address, ignoring letter case', () => {
    const token = unsubscribeToken('Jane@Example.com')
    expect(verifyUnsubscribeToken('jane@example.com', token)).toBe(true)
  })

  it('rejects a token for a different address, a tampered token, or a missing one', () => {
    const token = unsubscribeToken('jane@example.com')
    expect(verifyUnsubscribeToken('someone@example.com', token)).toBe(false)
    expect(verifyUnsubscribeToken('jane@example.com', token.slice(0, -2) + 'xx')).toBe(false)
    expect(verifyUnsubscribeToken('jane@example.com', '')).toBe(false)
  })

  it('rejects every token when AUTH_SECRET is not configured, rather than signing with an empty key', () => {
    const token = unsubscribeToken('jane@example.com')
    vi.stubEnv('AUTH_SECRET', '')
    expect(verifyUnsubscribeToken('jane@example.com', token)).toBe(false)
    expect(() => unsubscribeToken('jane@example.com')).toThrow()
  })

  it('builds an absolute link to the unsubscribe page', () => {
    const url = new URL(unsubscribeUrl('jane+news@example.com'))
    expect(url.pathname).toBe('/newsletter/unsubscribe')
    expect(url.searchParams.get('email')).toBe('jane+news@example.com')
    expect(verifyUnsubscribeToken('jane+news@example.com', url.searchParams.get('token')!)).toBe(true)
  })
})
