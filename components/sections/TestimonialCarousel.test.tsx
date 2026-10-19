// components/sections/TestimonialCarousel.test.tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Testimonial } from '@/lib/types'
import { TestimonialCarousel } from './TestimonialCarousel'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('@/lib/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: () => motionPrefs.reduced }))

function makeTestimonials(count: number): Testimonial[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    quote: `Quote ${i + 1}`,
    clientName: `Client ${i + 1}`,
    clientRole: 'Founder',
    avatarUrl: null,
    isPublished: true,
    sortOrder: i,
  }))
}

function currentDot() {
  return screen.getAllByRole('button', { name: /Show testimonial/ }).find((dot) => dot.getAttribute('aria-current'))
}

function stubViewport(desktop: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: desktop,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
}

beforeAll(() => {
  // jsdom lacks PointerEvent, so fireEvent.pointer* would drop clientX.
  if (!('PointerEvent' in window)) {
    Object.defineProperty(window, 'PointerEvent', { configurable: true, writable: true, value: MouseEvent })
  }
})

describe('TestimonialCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubViewport(false)
  })
  afterEach(() => {
    vi.useRealTimers()
    motionPrefs.reduced = false
  })

  it('shows one card per position on mobile, with a dot for each', () => {
    render(<TestimonialCarousel items={makeTestimonials(4)} />)
    expect(screen.getAllByRole('button', { name: /Show testimonial/ })).toHaveLength(4)
    expect(currentDot()).toHaveAccessibleName('Show testimonial 1')
    expect(screen.getByText('Quote 1')).toBeInTheDocument()
    expect(screen.getByText('Client 4')).toBeInTheDocument()
  })

  it('shows 3 cards at a time on desktop, so 4 testimonials have 2 positions', () => {
    stubViewport(true)
    render(<TestimonialCarousel items={makeTestimonials(4)} />)
    expect(screen.getAllByRole('button', { name: /Show testimonial/ })).toHaveLength(2)
  })

  it('auto-advances every 5 seconds and wraps around', () => {
    render(<TestimonialCarousel items={makeTestimonials(2)} />)
    act(() => vi.advanceTimersByTime(5000))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 2')
    act(() => vi.advanceTimersByTime(5000))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 1')
  })

  it('pauses while hovered or touched', () => {
    render(<TestimonialCarousel items={makeTestimonials(3)} />)
    const carousel = screen.getByRole('region', { name: 'Testimonials' })
    fireEvent.pointerEnter(carousel)
    act(() => vi.advanceTimersByTime(15000))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 1')

    fireEvent.pointerLeave(carousel)
    act(() => vi.advanceTimersByTime(5000))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 2')
  })

  it('jumps to the testimonial whose dot is clicked', () => {
    render(<TestimonialCarousel items={makeTestimonials(4)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show testimonial 3' }))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 3')
  })

  it('moves to the next or previous card on a horizontal swipe', () => {
    render(<TestimonialCarousel items={makeTestimonials(3)} />)
    const track = screen.getByTestId('carousel-viewport')

    fireEvent.pointerDown(track, { clientX: 300 })
    fireEvent.pointerUp(track, { clientX: 100 })
    expect(currentDot()).toHaveAccessibleName('Show testimonial 2')

    fireEvent.pointerDown(track, { clientX: 100 })
    fireEvent.pointerUp(track, { clientX: 300 })
    expect(currentDot()).toHaveAccessibleName('Show testimonial 1')
  })

  it('does not auto-advance for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    render(<TestimonialCarousel items={makeTestimonials(3)} />)
    act(() => vi.advanceTimersByTime(15000))
    expect(currentDot()).toHaveAccessibleName('Show testimonial 1')
  })

  it('hides the dots when every testimonial already fits on screen', () => {
    render(<TestimonialCarousel items={makeTestimonials(1)} />)
    expect(screen.queryByRole('button', { name: /Show testimonial/ })).not.toBeInTheDocument()
  })
})
