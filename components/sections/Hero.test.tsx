// components/sections/Hero.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Hero } from './Hero'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button data-testid="cal-trigger" className={className}>
      {children}
    </button>
  ),
}))

describe('Hero', () => {
  it('renders the headline, subheadline, and both CTAs', () => {
    const { container } = render(<Hero />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AI Automation & Intelligent Solutions for Modern Businesses')
    expect(screen.getByText(/Axonvia designs and builds/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Book a Free Strategy Call' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See Our Work' })).toHaveAttribute('href', '#projects')
    expect(container.querySelector('button button')).toBeNull()
  })

  it('stacks both CTAs full-width below 480px', () => {
    render(<Hero />)
    for (const cta of [
      screen.getByRole('button', { name: 'Book a Free Strategy Call' }),
      screen.getByRole('link', { name: 'See Our Work' }),
    ]) {
      expect(cta).toHaveClass('w-full', 'min-[480px]:w-auto')
    }
  })

  it('describes the four service areas without sales-agency framing or unverified claims', () => {
    const { container } = render(<Hero />)
    const subheadline = screen.getByText(/Axonvia designs and builds/)
    for (const area of ['AI automation', 'agentic AI', 'custom AI-powered applications', 'business workflow automation']) {
      expect(subheadline).toHaveTextContent(area)
    }
    expect(container).not.toHaveTextContent(/sales|lead generation|Trusted by/i)
  })

  it('shows an example agent run that ends by handing a decision to a person', () => {
    render(<Hero />)
    const run = screen.getByRole('figure')
    const steps = within(run).getAllByRole('listitem')
    expect(steps).toHaveLength(6)
    expect(steps[0]).toHaveTextContent('Message received on WhatsApp')
    expect(within(steps[5]).getByLabelText('Handed to a person')).toBeInTheDocument()
    expect(run).toHaveTextContent(/An example of the agents we build/)
  })

  it('shows the finished run, with no Replay control, when no animation has played', () => {
    render(<Hero />)
    expect(screen.queryByRole('button', { name: 'Replay' })).not.toBeInTheDocument()
    for (const done of screen.getAllByLabelText(/^(Done|Handed to a person)$/)) {
      expect(done).not.toHaveAttribute('style')
    }
  })

  it('reveals the headline word by word while keeping its exact text for screen readers and search', () => {
    const { container } = render(<Hero />)
    const words = Array.from(container.querySelectorAll('h1 [data-word]'), (word) => word.textContent)
    expect(words).toEqual('AI Automation & Intelligent Solutions for Modern Businesses'.split(' '))
  })

  it('fades the hero content away on scroll, except for visitors who prefer reduced motion', () => {
    const { container, unmount } = render(<Hero />)
    expect(container.querySelector('[data-scroll-fade]')).toHaveAttribute('data-scroll-fade', 'true')
    unmount()

    motionPrefs.reduced = true
    try {
      const { container: still } = render(<Hero />)
      expect(still.querySelector('[data-scroll-fade]')).toHaveAttribute('data-scroll-fade', 'false')
    } finally {
      motionPrefs.reduced = false
    }
  })
})
