import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

// Only public, indexable pages. /admin and /newsletter/unsubscribe are excluded (and disallowed in robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
