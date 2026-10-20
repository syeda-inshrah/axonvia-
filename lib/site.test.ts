// lib/site.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('siteConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses the real Axonvia inbox when no contact email is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', '')
    const { siteConfig } = await import('./site')
    expect(siteConfig.contactEmail).toBe('axonvia@gmail.com')
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

  it('falls back to Vercel’s production domain when NEXT_PUBLIC_SITE_URL is not set, so deploys never point at localhost', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'axonvia.vercel.app')
    expect((await import('./site')).siteConfig.url).toBe('https://axonvia.vercel.app')
  })

  it('prefers an explicit NEXT_PUBLIC_SITE_URL (e.g. a custom domain) over Vercel’s domain', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://axonvia.com')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'axonvia.vercel.app')
    expect((await import('./site')).siteConfig.url).toBe('https://axonvia.com')
  })
})
