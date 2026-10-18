// components/ui/GlassCard.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders its children', () => {
    render(<GlassCard>Card content</GlassCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('defaults to the blue hover border and switches to the navy one for the secondary accent', () => {
    const { rerender } = render(<GlassCard>Content</GlassCard>)
    expect(screen.getByText('Content')).toHaveClass('hover:border-[var(--border-glow)]')

    rerender(<GlassCard accent="purple">Content</GlassCard>)
    expect(screen.getByText('Content')).toHaveClass('hover:border-[var(--border-glow-alt)]')
  })

  it('omits the hover glow/lift entirely when glow={false}, for calmer sections like Why Axonvia', () => {
    render(<GlassCard glow={false}>Calm content</GlassCard>)
    const card = screen.getByText('Calm content')

    expect(card).not.toHaveClass('hover:-translate-y-1')
    expect(card.className).not.toMatch(/hover:shadow-\[0_0_40px/)
  })
})
