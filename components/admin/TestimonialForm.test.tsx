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

  it('lets the admin publish a testimonial, order it, and add an avatar', async () => {
    createTestimonial.mockResolvedValue({ success: true })
    const { TestimonialForm } = await import('./TestimonialForm')
    render(<TestimonialForm testimonial={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Great work' } })
    fireEvent.change(screen.getByLabelText('Client name'), { target: { value: 'Jane' } })
    fireEvent.click(screen.getByLabelText('Published on the site'))
    fireEvent.change(screen.getByLabelText('Sort order'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Avatar URL'), { target: { value: 'https://example.com/jane.jpg' } })
    fireEvent.click(screen.getByRole('button', { name: /add testimonial/i }))

    await waitFor(() =>
      expect(createTestimonial).toHaveBeenCalledWith(
        expect.objectContaining({ isPublished: true, sortOrder: 1, avatarUrl: 'https://example.com/jane.jpg' })
      )
    )
  })
})
