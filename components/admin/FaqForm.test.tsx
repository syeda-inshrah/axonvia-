import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createFaq = vi.fn()
const updateFaq = vi.fn()
vi.mock('@/app/actions/faqs', () => ({ createFaq, updateFaq }))

describe('FaqForm', () => {
  beforeEach(() => {
    createFaq.mockReset()
    updateFaq.mockReset()
  })

  it('calls createFaq when adding a new FAQ', async () => {
    createFaq.mockResolvedValue({ success: true })
    const { FaqForm } = await import('./FaqForm')
    render(<FaqForm faq={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Question'), { target: { value: 'What do you do?' } })
    fireEvent.change(screen.getByPlaceholderText('Answer'), { target: { value: 'We build AI agents.' } })
    fireEvent.click(screen.getByRole('button', { name: /add faq/i }))

    await waitFor(() => expect(createFaq).toHaveBeenCalled())
  })

  it('publishes new FAQs by default and lets the admin hide or reorder one', async () => {
    createFaq.mockResolvedValue({ success: true })
    const { FaqForm } = await import('./FaqForm')
    render(<FaqForm faq={null} onSaved={() => {}} />)

    expect(screen.getByLabelText('Published on the site')).toBeChecked()
    fireEvent.change(screen.getByLabelText('Question'), { target: { value: 'Q?' } })
    fireEvent.change(screen.getByLabelText('Answer'), { target: { value: 'A.' } })
    fireEvent.click(screen.getByLabelText('Published on the site'))
    fireEvent.change(screen.getByLabelText('Sort order'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /add faq/i }))

    await waitFor(() =>
      expect(createFaq).toHaveBeenCalledWith({ question: 'Q?', answer: 'A.', isPublished: false, sortOrder: 3 })
    )
  })
})
