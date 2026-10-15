import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@calcom/embed-react', () => ({
  getCalApi: vi.fn(async () => vi.fn()),
}))

describe('CalEmbed', () => {
  const originalEnv = process.env.NEXT_PUBLIC_CAL_LINK

  afterEach(() => {
    process.env.NEXT_PUBLIC_CAL_LINK = originalEnv
    vi.resetModules()
  })

  it('renders a mailto fallback link when no Cal.com link is configured', async () => {
    delete process.env.NEXT_PUBLIC_CAL_LINK
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed>Book a Call</CalEmbed>)

    const fallback = screen.getByTestId('cal-fallback')
    expect(fallback).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders a Cal.com trigger button when a link is configured', async () => {
    process.env.NEXT_PUBLIC_CAL_LINK = 'axonvia/strategy-call'
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed>Book a Call</CalEmbed>)

    const trigger = screen.getByTestId('cal-trigger')
    expect(trigger).toHaveAttribute('data-cal-link', 'axonvia/strategy-call')
  })

  it('styles the trigger as a button itself, so callers pass plain text instead of nesting a Button', async () => {
    process.env.NEXT_PUBLIC_CAL_LINK = 'axonvia/strategy-call'
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed size="large">Book a Call</CalEmbed>)

    const trigger = screen.getByTestId('cal-trigger')
    expect(trigger).toHaveClass('bg-[image:var(--accent-gradient)]', 'px-9')
    expect(trigger.querySelector('button')).toBeNull()
  })

  it('applies the requested variant to the mailto fallback', async () => {
    delete process.env.NEXT_PUBLIC_CAL_LINK
    const { CalEmbed } = await import('./CalEmbed')
    render(<CalEmbed variant="secondary" className="w-full">Book a Call</CalEmbed>)

    expect(screen.getByTestId('cal-fallback')).toHaveClass('border', 'w-full')
  })
})
