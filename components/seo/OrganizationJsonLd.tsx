import { SITE_URL, siteConfig } from '@/lib/site'

// Organization structured data for search engines: name, site, contact email, logo and official profiles.
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: SITE_URL,
    email: siteConfig.contactEmail,
    logo: `${SITE_URL}/icon.svg`,
    slogan: siteConfig.tagline,
    description: siteConfig.positioning,
    address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressCountry: 'PK' },
    areaServed: 'Worldwide',
    sameAs: Object.values(siteConfig.social),
  }
  // JSON.stringify output is safe here (no user input); escape "<" so it can never close the script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
