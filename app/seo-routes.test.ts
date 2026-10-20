// app/seo-routes.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'

// The site URL is read when lib/site loads, so each case sets the environment and then imports fresh.
async function load(env: Record<string, string>) {
  vi.resetModules()
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value)
  return { robots: (await import('./robots')).default, sitemap: (await import('./sitemap')).default }
}

const LOCAL = { NEXT_PUBLIC_SITE_URL: '', VERCEL_PROJECT_PRODUCTION_URL: '' }
const PRODUCTION = { NEXT_PUBLIC_SITE_URL: '', VERCEL_PROJECT_PRODUCTION_URL: 'axonvia.vercel.app' }

describe('robots.txt', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('keeps crawlers out of the admin area and the unsubscribe page, and points at the sitemap', async () => {
    const { robots } = await load(LOCAL)
    const rules = robots()
    const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/newsletter/unsubscribe']))
    expect(rules.sitemap).toBe('http://localhost:3000/sitemap.xml')
  })

  it('points at the production sitemap on Vercel', async () => {
    const { robots } = await load(PRODUCTION)
    expect(robots().sitemap).toBe('https://axonvia.vercel.app/sitemap.xml')
  })
})

describe('sitemap.xml', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('lists exactly the public pages as canonical production URLs on Vercel', async () => {
    const { sitemap } = await load(PRODUCTION)
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://axonvia.vercel.app/',
      'https://axonvia.vercel.app/privacy',
      'https://axonvia.vercel.app/terms',
    ])
  })

  it('never lists localhost, admin or unsubscribe pages in production', async () => {
    const { sitemap } = await load(PRODUCTION)
    for (const { url } of sitemap()) {
      expect(url).toMatch(/^https:\/\/axonvia\.vercel\.app\//)
      expect(url).not.toMatch(/localhost|\/admin|unsubscribe/)
    }
  })

  it('uses the configured site URL, so a custom domain only needs NEXT_PUBLIC_SITE_URL', async () => {
    const { sitemap } = await load({ NEXT_PUBLIC_SITE_URL: 'https://axonvia.com/', VERCEL_PROJECT_PRODUCTION_URL: 'axonvia.vercel.app' })
    expect(sitemap()[0].url).toBe('https://axonvia.com/')
  })
})
