// next.config.test.ts
import { describe, expect, it } from 'vitest'
import nextConfig from './next.config'

async function headersFor(source: string) {
  const rules = (await nextConfig.headers?.()) ?? []
  const rule = rules.find((r) => r.source === source)
  return Object.fromEntries((rule?.headers ?? []).map((h) => [h.key, h.value]))
}

describe('security headers', () => {
  it('sends the standard hardening headers on every route', async () => {
    const headers = await headersFor('/:path*')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['Strict-Transport-Security']).toMatch(/max-age=\d+/)
    expect(headers['Permissions-Policy']).toContain('camera=()')
  })

  it('sets a Content-Security-Policy that blocks framing, plugins, frames and foreign scripts', async () => {
    const csp = (await headersFor('/:path*'))['Content-Security-Policy']
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-src 'none'")
    expect(csp).not.toMatch(/cal\.com/)
    expect(csp).not.toContain("'unsafe-eval'")
  })

  it('keeps the admin area out of search engines', async () => {
    expect((await headersFor('/admin/:path*'))['X-Robots-Tag']).toBe('noindex, nofollow')
  })

  it('does not advertise the framework', () => {
    expect(nextConfig.poweredByHeader).toBe(false)
  })
})
