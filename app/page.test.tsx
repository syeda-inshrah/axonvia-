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

  it('publishes Organization structured data with the official profiles', async () => {
    const { container } = render(await HomePage())
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!)
    expect(data).toMatchObject({ '@type': 'Organization', name: 'Axonvia', url: 'https://axonviaai.com', email: 'axonvia@gmail.com' })
    expect(data.sameAs).toEqual(expect.arrayContaining(['https://x.com/axonvia_ai', 'https://www.facebook.com/Axonvia/']))
  })

  it('opts into request-time rendering so CMS edits show without a rebuild', async () => {
    connection.mockClear()
    await HomePage()
    expect(connection).toHaveBeenCalled()
  })
})
