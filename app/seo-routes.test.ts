// app/seo-routes.test.ts
import { describe, expect, it } from 'vitest'
import robots from './robots'
import sitemap from './sitemap'

describe('robots.txt', () => {
  it('keeps crawlers out of the admin area and the unsubscribe page, and points at the sitemap', () => {
    const rules = robots()
    const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules
    expect(rule.disallow).toEqual(expect.arrayContaining(['/admin', '/newsletter/unsubscribe']))
    expect(rules.sitemap).toBe('http://localhost:3000/sitemap.xml')
  })
})

describe('sitemap.xml', () => {
  it('lists only the public pages, as absolute URLs on the configured site', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'http://localhost:3000',
      'http://localhost:3000/privacy',
      'http://localhost:3000/terms',
    ])
  })
})
