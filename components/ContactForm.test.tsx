import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const submitContactForm = vi.fn()
vi.mock('@/app/actions/contact', () => ({ submitContactForm }))

describe('ContactForm', () => {
  beforeEach(() => submitContactForm.mockReset())

  it('shows a success message after a successful submit', async () => {
    submitContactForm.mockResolvedValue({ success: true })
    const { ContactForm } = await import('./ContactForm')
    render(<ContactForm />)

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByTestId('form-success')).toBeInTheDocument())
  })

  it('shows an error message after a failed submit', async () => {
    submitContactForm.mockResolvedValue({ success: false, error: 'Enter a valid email address' })
    const { ContactForm } = await import('./ContactForm')
    render(<ContactForm />)

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByTestId('form-error')).toHaveTextContent('Enter a valid email address'))
  })

  it('sends the spam-trap fields along with the message', async () => {
    submitContactForm.mockResolvedValue({ success: true })
    const { ContactForm } = await import('./ContactForm')
    const { container } = render(<ContactForm />)

    const honeypot = container.querySelector('input[name="website"]')
    expect(honeypot).toHaveAttribute('tabindex', '-1')
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull()

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(submitContactForm).toHaveBeenCalled())
    const sent = submitContactForm.mock.calls[0][0] as FormData
    expect(sent.get('website')).toBe('')
    expect(Number(sent.get('startedAt'))).toBeGreaterThan(0)
  })

  it('labels every visible field for screen readers', async () => {
    const { ContactForm } = await import('./ContactForm')
    render(<ContactForm />)
    for (const label of ['Name', 'Email', 'Company', 'Message']) {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    }
  })
})
