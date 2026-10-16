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
})
