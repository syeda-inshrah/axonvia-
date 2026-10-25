// components/sections/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Footer } from './Footer'

vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter: vi.fn() }))

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
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents & Intelligent Assistants',
      'Custom AI-Powered Software',
      'System Integration & Workflow Design',
    ])
  })

  it('links the configured contact email', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'axonvia@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:axonvia@gmail.com'
    )
  })

  it('tells subscribers they can unsubscribe and links the privacy policy beside the signup', () => {
    render(<Footer />)
    const note = screen.getByText(/Unsubscribe any time/)
    expect(note.querySelector('a[href="/privacy"]')).not.toBeNull()
  })

  it('links Axonvia on Instagram, Facebook, X and LinkedIn with accessible icon buttons that open in a new tab', () => {
    render(<Footer />)
    const expected: [string, string][] = [
      ['Axonvia on Instagram', 'https://www.instagram.com/axonvia.ai/'],
      ['Axonvia on Facebook', 'https://www.facebook.com/Axonvia/'],
      ['Axonvia on X', 'https://x.com/axonvia_ai'],
      ['Axonvia founder on LinkedIn', 'https://www.linkedin.com/in/syedainshrahkhatoon/'],
    ]
    for (const [name, href] of expected) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('has no link to the removed Work section, and shows the tagline and service area', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('a[href="#projects"]')).toBeNull()
    expect(screen.getByText('AI that works for your business.')).toBeInTheDocument()
    expect(screen.getByText(/Serving clients worldwide/)).toBeInTheDocument()
  })
})
