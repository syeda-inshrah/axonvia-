import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const subscribeNewsletter = vi.fn()
vi.mock('@/app/actions/newsletter', () => ({ subscribeNewsletter }))

describe('NewsletterForm', () => {
  beforeEach(() => subscribeNewsletter.mockReset())

  it('shows a success message after a successful subscribe', async () => {
    subscribeNewsletter.mockResolvedValue({ success: true })
    const { NewsletterForm } = await import('./NewsletterForm')
    render(<NewsletterForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => expect(screen.getByTestId('newsletter-success')).toBeInTheDocument())
  })
})
