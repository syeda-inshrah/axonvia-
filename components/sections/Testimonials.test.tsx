// components/sections/Testimonials.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedTestimonials = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedTestimonials }))

describe('Testimonials', () => {
  beforeEach(() => getPublishedTestimonials.mockReset())

  it('shows the trust-strip fallback when there are no published testimonials', async () => {
    getPublishedTestimonials.mockResolvedValue([])
    const { Testimonials } = await import('./Testimonials')
    const { container } = render(await Testimonials())

    expect(container.querySelector('button button')).toBeNull()
    expect(screen.getByText(/Early-stage and building in public/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Be one of our first case studies/i })).toHaveAttribute('href', '#final-cta')
  })

  it('shows testimonial cards when published testimonials exist', async () => {
    getPublishedTestimonials.mockResolvedValue([
      { id: '1', quote: 'Great work', clientName: 'Jane', clientRole: 'CEO', avatarUrl: null, isPublished: true, sortOrder: 0 },
    ])
    const { Testimonials } = await import('./Testimonials')
    render(await Testimonials())

    expect(screen.getByText('Great work')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })
})
