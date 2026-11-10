// app/landing-pages.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import VoicePage, { metadata as voiceMeta } from './ai-voice-agents/page'
import ChatbotsPage, { metadata as chatbotsMeta } from './ai-chatbots/page'
import RealEstatePage, { metadata as realEstateMeta } from './real-estate-ai-automation/page'
import ServicesPage, { metadata as servicesMeta } from './services/page'

vi.mock('@/app/actions/contact', () => ({ submitContactForm: vi.fn() }))
vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter: vi.fn() }))

const PAGES = [
  ['/ai-voice-agents', VoicePage, voiceMeta, /AI voice agents/],
  ['/ai-chatbots', ChatbotsPage, chatbotsMeta, /AI chatbots/],
  ['/real-estate-ai-automation', RealEstatePage, realEstateMeta, /Real estate AI automation/],
  ['/services', ServicesPage, servicesMeta, /AI automation services/],
] as const

function graph(container: HTMLElement) {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'), (s) => JSON.parse(s.textContent!)).flatMap(
    (d) => d['@graph'] ?? [d]
  )
}

describe.each(PAGES)('%s', (path, Page, meta, h1) => {
  it('has one keyword-led H1, a breadcrumb, the contact form and navigation back to the homepage sections', () => {
    const { container } = render(<Page />)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(h1)
    expect(within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(container.querySelector('#final-cta form')).not.toBeNull()
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
  })

  it('has its own canonical URL, a title under 60 characters with the brand, and a description under 160', () => {
    expect(meta.alternates?.canonical).toBe(path)
    expect(`${meta.title} | Axonvia`.length).toBeLessThanOrEqual(60)
    expect(String(meta.description).length).toBeLessThanOrEqual(160)
    expect(meta.openGraph).toMatchObject({ url: path, images: [{ url: '/opengraph-image' }] })
  })

  it('publishes FAQPage data for exactly the questions shown, and a breadcrumb ending at this page', () => {
    const { container } = render(<Page />)
    const nodes = graph(container)
    const faq = nodes.find((n) => n['@type'] === 'FAQPage')
    const shown = within(container.querySelector('#faq') as HTMLElement).getAllByRole('button').map((b) => b.textContent)
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(shown)
    const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList').itemListElement
    expect(crumbs.at(-1).item).toBe(`https://www.axonviaai.com${path}`)
  })

  it('makes no unconfirmed claims: no prices, percentages, working hours or testimonials', () => {
    const { container } = render(<Page />)
    const text = container.querySelector('main')!.textContent!
    expect(text).not.toMatch(/\$\s?\d|\d+\s?%|\b\d{1,2}\s?(am|pm)\b|testimonial|trusted by|clients served/i)
  })
})

describe('solution pages', () => {
  it('describe a Service provided by Axonvia, serving the United States and worldwide', () => {
    for (const Page of [VoicePage, ChatbotsPage, RealEstatePage]) {
      const { container, unmount } = render(<Page />)
      const service = graph(container).find((n) => n['@type'] === 'Service')
      expect(service.provider['@id']).toBe('https://www.axonviaai.com/#organization')
      expect(service.areaServed).toEqual([{ '@type': 'Country', name: 'United States' }, 'Worldwide'])
      unmount()
    }
  })

  it('label the hero conversation as an illustrative example', () => {
    render(<VoicePage />)
    expect(screen.getByText(/Illustrative example; names and details are fictional/)).toBeInTheDocument()
  })

  it('link to the other solution pages and the services hub', () => {
    render(<ChatbotsPage />)
    const related = screen.getByRole('heading', { name: 'Related services' }).closest('section')!
    expect(Array.from(related.querySelectorAll('a'), (a) => a.getAttribute('href'))).toEqual([
      '/ai-voice-agents',
      '/real-estate-ai-automation',
      '/services',
    ])
  })
})

describe('services hub', () => {
  it('links every solution page and gives each core service an anchor the footer links to', () => {
    const { container } = render(<ServicesPage />)
    for (const path of ['/ai-voice-agents', '/ai-chatbots', '/real-estate-ai-automation']) {
      expect(container.querySelector(`main a[href="${path}"]`)).not.toBeNull()
    }
    for (const slug of ['process-automation', 'lead-management', 'ai-agents', 'custom-software', 'integration']) {
      expect(container.querySelector(`#${slug}`)).not.toBeNull()
    }
  })
})
