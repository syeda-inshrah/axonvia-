// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from './page'

vi.mock('@/components/sections/Faq', () => ({ Faq: () => <div>Faq stub</div> }))
const { connection } = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }))
vi.mock('next/server', () => ({ connection }))
vi.mock('@/app/actions/contact', () => ({ submitContactForm: vi.fn() }))
vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter: vi.fn() }))

describe('HomePage', () => {
  it('renders the Navbar brand, Hero headline, and Footer copyright in order', async () => {
    render(await HomePage())

    expect(screen.getByRole('link', { name: 'Axonvia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'AI automation that runs your operations, so your team can focus on growth.'
    )
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })

  it('has exactly one H1, the new sections, and no Work/Projects section or links', async () => {
    const { container } = render(await HomePage())
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('#projects')).toBeNull()
    expect(container.querySelector('a[href="#projects"]')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Built for growing service businesses' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Become one of our founding clients' })).toBeInTheDocument()
  })

  it('points every booking button at the contact form section, which exists on the page', async () => {
    const { container } = render(await HomePage())
    const booking = container.querySelectorAll('a[data-booking]')
    expect(booking.length).toBeGreaterThan(2)
    for (const link of booking) expect(link).toHaveAttribute('href', '#final-cta')
    expect(container.querySelector('#final-cta')).not.toBeNull()
  })

  function structuredData(container: HTMLElement) {
    return Array.from(container.querySelectorAll('script[type="application/ld+json"]'), (s) => JSON.parse(s.textContent!))
  }

  it('publishes Organization structured data with the official company profiles', async () => {
    const { container } = render(await HomePage())
    const graph = structuredData(container).flatMap((d) => d['@graph'] ?? [d])
    const org = graph.find((n) => n['@type'] === 'Organization')
    expect(org).toMatchObject({ name: 'Axonvia', url: 'https://www.axonviaai.com', email: 'axonvia@gmail.com' })
    expect(org.sameAs).toEqual(expect.arrayContaining(['https://x.com/axonvia_ai', 'https://www.facebook.com/Axonvia/']))
    // The LinkedIn link is the founder's personal profile, not the company's.
    expect(org.sameAs.join(' ')).not.toContain('linkedin.com/in/')
  })

  it('describes the website and each of the five services, all provided by the organization', async () => {
    const { container } = render(await HomePage())
    const graph = structuredData(container).flatMap((d) => d['@graph'] ?? [d])
    const org = graph.find((n) => n['@type'] === 'Organization')
    expect(graph.find((n) => n['@type'] === 'WebSite')).toMatchObject({ url: 'https://www.axonviaai.com', publisher: { '@id': org['@id'] } })
    const services = graph.filter((n) => n['@type'] === 'Service')
    expect(services.map((s) => s.name)).toEqual([
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents & Intelligent Assistants',
      'Custom AI-Powered Software',
      'System Integration & Workflow Design',
    ])
    for (const service of services) expect(service.provider).toEqual({ '@id': org['@id'] })
  })

  it('opts into request-time rendering so CMS edits show without a rebuild', async () => {
    connection.mockClear()
    await HomePage()
    expect(connection).toHaveBeenCalled()
  })
})
