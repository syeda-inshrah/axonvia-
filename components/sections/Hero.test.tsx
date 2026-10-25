// components/sections/Hero.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Hero } from './Hero'

const HEADLINE = 'AI automation that runs your operations, so your team can focus on growth.'

describe('Hero', () => {
  it('renders the headline, subheadline, both CTAs and the trust line', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HEADLINE)
    expect(
      screen.getByText(/Axonvia automates repetitive work, manages your leads intelligently, and builds AI-powered systems/)
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Book a Free Automation Audit' })).toHaveAttribute('href', '#final-cta')
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '#story')
    expect(screen.getByText('Free 20-minute call · No commitment · We work in your time zone')).toBeInTheDocument()
  })

  it('stacks both CTAs full-width below 480px', () => {
    render(<Hero />)
    for (const name of ['Book a Free Automation Audit', 'See how it works']) {
      expect(screen.getByRole('link', { name })).toHaveClass('w-full', 'min-[480px]:w-auto')
    }
  })

  it('does not lead with calling, and makes no unverified claims', () => {
    const { container } = render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveTextContent(/call|voice/i)
    expect(container).not.toHaveTextContent(/Trusted by|clients served|\d+%/i)
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
    expect(words).toEqual(HEADLINE.split(' '))
  })

  it('renders the finished state when no animation runs: nothing hidden or moved inline', () => {
    const { container } = render(<Hero />)
    for (const el of container.querySelectorAll<HTMLElement>('[data-intro], [data-word], [data-hero-content]')) {
      expect(el.style.visibility).toBe('')
      expect(el.style.transform).toBe('')
    }
  })
})
