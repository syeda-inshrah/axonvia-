// components/sections/Hero.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Hero } from './Hero'

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

  it('opens the AI assistant from the hero', () => {
    const opened = vi.fn()
    window.addEventListener('axonvia:open-chat', opened)
    render(<Hero />)
    fireEvent.click(screen.getByRole('button', { name: 'Ask our AI assistant' }))
    expect(opened).toHaveBeenCalledTimes(1)
    window.removeEventListener('axonvia:open-chat', opened)
  })

  it('draws the 3D neural core as decoration, hidden from assistive tech', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('canvas[data-neural-core]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('reveals the headline word by word while keeping its exact text for screen readers and search', () => {
    const { container } = render(<Hero />)
    const words = Array.from(container.querySelectorAll('h1 [data-word]'), (word) => word.textContent)
    expect(words).toEqual('AI Automation & Intelligent Solutions for Modern Businesses'.split(' '))
  })

  it('renders the finished state when no animation runs: nothing hidden or moved inline', () => {
    const { container } = render(<Hero />)
    for (const el of container.querySelectorAll<HTMLElement>('[data-intro], [data-word], [data-hero-content]')) {
      expect(el.style.visibility).toBe('')
      expect(el.style.transform).toBe('')
    }
  })
})
