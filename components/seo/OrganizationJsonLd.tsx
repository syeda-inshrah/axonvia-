import { SITE_URL, services, siteConfig } from '@/lib/site'
import { JsonLd } from '@/components/seo/JsonLd'

const ORG_ID = `${SITE_URL}/#organization`

// Structured data for search engines: the organization and its official profiles, the website, and each service
// it provides, linked by @id so they read as one entity.
export function OrganizationJsonLd() {
  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.name,
    url: SITE_URL,
    email: siteConfig.contactEmail,
    logo: `${SITE_URL}/icon.svg`,
    slogan: siteConfig.tagline,
    description: siteConfig.positioning,
    address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressCountry: 'PK' },
    areaServed: 'Worldwide',
    knowsAbout: ['AI automation', 'Workflow automation', 'Lead management', 'AI chatbots', 'AI voice agents', 'Real estate automation', 'Custom software'],
    // Company profiles only; the LinkedIn link is the founder's personal profile.
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.x],
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: siteConfig.name,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  }
  const offered = services.map((service) => ({
    '@type': 'Service',
    '@id': `${SITE_URL}/#${service.slug}`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: { '@id': ORG_ID },
    areaServed: 'Worldwide',
    url: `${SITE_URL}/services#${service.slug}`,
  }))

  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': [organization, website, ...offered] }} />
}
