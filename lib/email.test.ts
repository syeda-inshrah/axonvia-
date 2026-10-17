import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn(async () => ({ data: { id: 'email_123' }, error: null }))
vi.mock('resend', () => ({
  // Like the real client: constructing without an API key throws.
  Resend: vi.fn().mockImplementation(function MockResend(apiKey?: string) {
    if (!apiKey) throw new Error('Missing API key')
    return { emails: { send } }
  }),
}))

describe('email helpers', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.RESEND_FROM_EMAIL = 'Axonvia <hello@axonvia.example>'
    process.env.ADMIN_NOTIFICATION_EMAIL = 'admin@axonvia.example'
    process.env.AUTH_SECRET = 'test-secret'
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

  it('sendNewsletterWelcome includes a working unsubscribe link in the body and the List-Unsubscribe header', async () => {
    process.env.AUTH_SECRET = 'test-secret'
    const { sendNewsletterWelcome } = await import('./email')
    await sendNewsletterWelcome('jane@example.com')

    const sent = (send.mock.calls[0] as unknown as [{ text: string; headers: Record<string, string> }])[0]
    const link = sent.text.match(/https?:\/\/\S+\/newsletter\/unsubscribe\?\S+/)?.[0]
    expect(link).toBeDefined()
    expect(new URL(link!).searchParams.get('email')).toBe('jane@example.com')
    expect(sent.headers['List-Unsubscribe']).toBe(`<${link}>`)
  })

  it('skips sending (instead of crashing the contact and newsletter actions) when RESEND_API_KEY is not configured', async () => {
    vi.resetModules()
    delete process.env.RESEND_API_KEY
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { sendContactNotification } = await import('./email')

    await expect(sendContactNotification({ name: 'Jane', email: 'jane@example.com' })).resolves.toBeNull()
    expect(send).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('RESEND_API_KEY'))
    warn.mockRestore()
  })
})
