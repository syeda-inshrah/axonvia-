// components/sections/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <button data-testid="cal-trigger">{children}</button>,
}))

describe('Hero', () => {
  it('renders the headline, subheadline, and both CTAs', async () => {
    const { Hero } = await import('./Hero')
    const { container } = render(<Hero />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('We Build AI Agents That Run Your Business')
    expect(screen.getByText(/Axonvia designs, builds, and deploys/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Book a Free Strategy Call' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See Our Work' })).toHaveAttribute('href', '#projects')
    expect(container.querySelector('button button')).toBeNull()
  })
})
