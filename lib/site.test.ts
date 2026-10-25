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

  it('keeps the canonical site URL in one constant, without a trailing slash', async () => {
    const { SITE_URL, siteConfig } = await import('./site')
    expect(SITE_URL).toBe('https://axonviaai.com')
    expect(siteConfig.url).toBe(SITE_URL)
  })

  it('sends booking buttons to the contact form until a booking page exists', async () => {
    const { BOOKING_URL } = await import('./site')
    expect(BOOKING_URL).toBe('#final-cta')
  })

  it('uses the exact tagline and the official social profiles', async () => {
    const { siteConfig } = await import('./site')
    expect(siteConfig.tagline).toBe('AI that works for your business.')
    expect(siteConfig.social).toEqual({
      instagram: 'https://www.instagram.com/axonvia.ai/',
      facebook: 'https://www.facebook.com/Axonvia/',
      x: 'https://x.com/axonvia_ai',
      linkedin: 'https://www.linkedin.com/in/syedainshrahkhatoon/',
    })
  })

  it('offers exactly the five services, each with example bullets', async () => {
    const { services } = await import('./site')
    expect(services.map((service) => service.title)).toEqual([
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents & Intelligent Assistants',
      'Custom AI-Powered Software',
      'System Integration & Workflow Design',
    ])
    for (const service of services) expect(service.examples.length).toBeGreaterThanOrEqual(2)
  })
})
