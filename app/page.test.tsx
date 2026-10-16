// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from './page'

vi.mock('@/components/sections/Projects', () => ({ Projects: () => <div>Projects stub</div> }))
vi.mock('@/components/sections/Testimonials', () => ({ Testimonials: () => <div>Testimonials stub</div> }))
vi.mock('@/components/sections/Faq', () => ({ Faq: () => <div>Faq stub</div> }))
const { connection } = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }))
vi.mock('next/server', () => ({ connection }))
vi.mock('@/app/actions/contact', () => ({ submitContactForm: vi.fn() }))
vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter: vi.fn() }))
vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('HomePage', () => {
  it('renders the Navbar brand, Hero headline, and Footer copyright in order', async () => {
    render(await HomePage())

    expect(screen.getByRole('link', { name: 'Axonvia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'AI Automation & Intelligent Solutions for Modern Businesses'
    )
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })

  it('opts into request-time rendering so CMS edits show without a rebuild', async () => {
    connection.mockClear()
    await HomePage()
    expect(connection).toHaveBeenCalled()
  })
})
