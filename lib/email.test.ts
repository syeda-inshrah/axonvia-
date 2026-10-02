import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn(async () => ({ data: { id: 'email_123' }, error: null }))
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function MockResend() {
    return { emails: { send } }
  }),
}))

describe('email helpers', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_FROM_EMAIL = 'Axonvia <hello@axonvia.example>'
    process.env.ADMIN_NOTIFICATION_EMAIL = 'admin@axonvia.example'
    send.mockClear()
  })

  it('sendContactNotification sends to the admin address', async () => {
    const { sendContactNotification } = await import('./email')
    await sendContactNotification({ name: 'Jane', email: 'jane@example.com' })

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'admin@axonvia.example', subject: expect.stringContaining('Jane') })
    )
  })

  it('sendContactConfirmation sends to the submitter', async () => {
    const { sendContactConfirmation } = await import('./email')
    await sendContactConfirmation({ name: 'Jane', email: 'jane@example.com' })

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'jane@example.com' }))
  })

  it('sendNewsletterWelcome sends to the subscriber', async () => {
    const { sendNewsletterWelcome } = await import('./email')
    await sendNewsletterWelcome('jane@example.com')

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'jane@example.com' }))
  })
})
