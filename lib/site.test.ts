// lib/site.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('siteConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('falls back to a clearly non-real placeholder inbox until one is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', '')
    const { siteConfig } = await import('./site')
    expect(siteConfig.contactEmail).toBe('hello@axonvia.example')
  })

  it('uses NEXT_PUBLIC_CONTACT_EMAIL when set, so one variable updates every contact link', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'team@axonvia.com')
    const { siteConfig } = await import('./site')
    expect(siteConfig.contactEmail).toBe('team@axonvia.com')
  })

  it('uses NEXT_PUBLIC_SITE_URL (without a trailing slash) for absolute links, falling back to localhost', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://axonvia.example/')
    expect((await import('./site')).siteConfig.url).toBe('https://axonvia.example')

    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    expect((await import('./site')).siteConfig.url).toBe('http://localhost:3000')
  })
})
