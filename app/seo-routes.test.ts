// app/seo-routes.test.ts
import { describe, expect, it } from 'vitest'
import robots from './robots'
import sitemap from './sitemap'

describe('robots.txt', () => {
  it('keeps crawlers out of the admin area and the unsubscribe page, and points at the production sitemap', () => {
    const rules = robots()
    const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/newsletter/unsubscribe']))
    expect(rules.sitemap).toBe('https://www.axonviaai.com/sitemap.xml')
  })
})

describe('sitemap.xml', () => {
  it('lists exactly the public pages as canonical URLs on SITE_URL', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://www.axonviaai.com/',
      'https://www.axonviaai.com/privacy',
      'https://www.axonviaai.com/terms',
    ])
  })

  it('never lists localhost, the old Vercel address, admin or unsubscribe pages', () => {
    for (const { url } of sitemap()) expect(url).not.toMatch(/localhost|vercel\.app|\/admin|unsubscribe|#/)
  })
})
