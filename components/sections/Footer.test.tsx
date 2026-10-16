// components/sections/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Footer } from './Footer'

vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter: vi.fn() }))
vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))

describe('Footer', () => {
  it('renders all 4 columns and the copyright line', () => {
    render(<Footer />)

    expect(screen.getByRole('heading', { name: 'Navigate' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })

  it('offers the newsletter signup', () => {
    render(<Footer />)
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('lists the same services the Services section offers', () => {
    render(<Footer />)
    const services = screen.getByRole('navigation', { name: 'Services' })
    expect(Array.from(services.querySelectorAll('a'), (link) => link.textContent)).toEqual([
      'AI Agent Development',
      'Workflow Automation',
      'AI-Powered Products',
      'Conversational AI & Chatbots',
      'Data & Integration',
      'AI Strategy & Consulting',
    ])
  })

  it('links the configured contact email', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'hello@axonvia.example' })).toHaveAttribute(
      'href',
      'mailto:hello@axonvia.example'
    )
  })
})
