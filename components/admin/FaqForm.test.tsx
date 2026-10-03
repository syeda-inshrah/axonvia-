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
})
