// lib/rate-limit.test.ts
import { describe, expect, it } from 'vitest'
import { createRateLimiter } from './rate-limit'

describe('createRateLimiter', () => {
  it('allows up to the limit within the window, then blocks with a retry time', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 })
    expect([1, 2, 3].map(() => limiter.hit('k', 0).allowed)).toEqual([true, true, true])
    const blocked = limiter.hit('k', 10_000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterMs).toBe(50_000)
  })

  it('reports whether a key is blocked without consuming an attempt', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 })
    expect(limiter.isBlocked('k', 0)).toBe(false)
    limiter.hit('k', 0)
    expect(limiter.isBlocked('k', 1)).toBe(true)
    expect(limiter.isBlocked('k', 1)).toBe(true)
  })

  it('starts a fresh window once the old one expires', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 })
    limiter.hit('k', 0)
    expect(limiter.hit('k', 59_999).allowed).toBe(false)
    expect(limiter.hit('k', 60_000).allowed).toBe(true)
  })

  it('tracks keys independently and can reset one', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 })
    limiter.hit('a', 0)
    expect(limiter.hit('b', 0).allowed).toBe(true)
    limiter.reset('a')
    expect(limiter.hit('a', 0).allowed).toBe(true)
  })
})
