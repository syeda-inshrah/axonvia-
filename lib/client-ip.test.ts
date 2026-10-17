// lib/client-ip.test.ts
import { describe, expect, it } from 'vitest'
import { clientIp } from './client-ip'

describe('clientIp', () => {
  it('uses the first address in x-forwarded-for (the original client)', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7')
  })

  it('falls back to x-real-ip, then to a shared "unknown" bucket', () => {
    expect(clientIp(new Headers({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})
