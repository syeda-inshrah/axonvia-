import { SITE_URL, siteConfig } from '@/lib/site'
import type { LandingPageContent } from '@/lib/landing-pages'

export const ORG_ID = `${SITE_URL}/#organization`

/** BreadcrumbList for a page under the services hub. */
export function breadcrumb(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${SITE_URL}${item.path}` })),
  }
}

/** Service, FAQPage and breadcrumb structured data for one landing page, matching what the page shows. */
export function landingJsonLd(page: LandingPageContent) {
  const url = `${SITE_URL}${page.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.description,
        url,
        provider: { '@type': 'Organization', '@id': ORG_ID, name: siteConfig.name, url: SITE_URL },
        areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: page.name, path: page.path },
      ]),
    ],
  }
}
