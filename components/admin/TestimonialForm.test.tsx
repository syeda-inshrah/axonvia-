import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createTestimonial = vi.fn()
const updateTestimonial = vi.fn()
vi.mock('@/app/actions/testimonials', () => ({ createTestimonial, updateTestimonial }))

describe('TestimonialForm', () => {
  beforeEach(() => {
    createTestimonial.mockReset()
    updateTestimonial.mockReset()
  })

  it('calls createTestimonial when adding a new testimonial', async () => {
    createTestimonial.mockResolvedValue({ success: true })
    const { TestimonialForm } = await import('./TestimonialForm')
    render(<TestimonialForm testimonial={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Quote'), { target: { value: 'Great work' } })
    fireEvent.change(screen.getByPlaceholderText('Client name'), { target: { value: 'Jane' } })
    fireEvent.click(screen.getByRole('button', { name: /add testimonial/i }))

    await waitFor(() => expect(createTestimonial).toHaveBeenCalled())
  })
})
