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

  it('sends the spam-trap fields and labels the email field', async () => {
    subscribeNewsletter.mockResolvedValue({ success: true })
    const { NewsletterForm } = await import('./NewsletterForm')
    const { container } = render(<NewsletterForm />)

    expect(container.querySelector('input[name="website"]')?.closest('[aria-hidden="true"]')).not.toBeNull()
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => expect(subscribeNewsletter).toHaveBeenCalled())
    const sent = subscribeNewsletter.mock.calls[0][0] as FormData
    expect(sent.get('website')).toBe('')
    expect(Number(sent.get('startedAt'))).toBeGreaterThan(0)
  })
})
