/**
 * Fixed-window, in-memory rate limiter.
 *
 * State lives in this server process, so on a multi-instance/serverless host each instance counts separately
 * and counts reset on cold start. It still caps brute force and form spam per instance; swap for a shared
 * store (e.g. Redis/Upstash) if the host scales out — see docs/ENVIRONMENT.md.
 */
interface Window {
  count: number
  resetAt: number
}

const MAX_TRACKED_KEYS = 10_000

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>()

  function current(key: string, now: number): Window | undefined {
    const window = windows.get(key)
    if (window && now >= window.resetAt) {
      windows.delete(key)
      return undefined
    }
    return window
  }

  function pruneExpired(now: number) {
    for (const [key, window] of windows) if (now >= window.resetAt) windows.delete(key)
  }

  return {
    /** Records an attempt; allowed is false once the key has used up its limit for this window. */
    hit(key: string, now = Date.now()) {
      if (windows.size >= MAX_TRACKED_KEYS) pruneExpired(now)
      const window = current(key, now) ?? { count: 0, resetAt: now + windowMs }
      window.count += 1
      windows.set(key, window)
      return { allowed: window.count <= limit, retryAfterMs: Math.max(0, window.resetAt - now) }
    },
    /** True when the key has already used up its limit; does not record an attempt. */
    isBlocked(key: string, now = Date.now()) {
      const window = current(key, now)
      return window !== undefined && window.count >= limit
    },
    reset(key: string) {
      windows.delete(key)
    },
  }
}
