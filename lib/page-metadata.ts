import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site'

/**
 * Complete metadata for a page other than the homepage: title (the layout adds " | Axonvia"), description,
 * canonical URL, and Open Graph / X cards with the shared share image. Setting openGraph on a page replaces the
 * layout's, so the image and X card are restated here rather than lost.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${siteConfig.name}: ${siteConfig.tagline}` }],
    },
    twitter: { card: 'summary_large_image', site: siteConfig.xHandle, title: fullTitle, description, images: ['/twitter-image'] },
  }
}
