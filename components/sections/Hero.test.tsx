// components/sections/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Hero } from './Hero'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
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

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('We Build AI Agents That Run Your Business')
    expect(screen.getByText(/Axonvia designs, builds, and deploys/)).toBeInTheDocument()
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

  it('animates the network visual by default', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('svg[data-animated]')).toHaveAttribute('data-animated', 'true')
  })

  it('keeps the network visual still for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<Hero />)
      expect(container.querySelector('svg[data-animated]')).toHaveAttribute('data-animated', 'false')
    } finally {
      motionPrefs.reduced = false
    }
  })
})
