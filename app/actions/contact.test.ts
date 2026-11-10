import { describe, it, expect, vi, beforeEach } from 'vitest'

const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendContactNotification = vi.fn<(lead: unknown) => Promise<unknown>>(async () => ({ id: 'email_1' }))
const sendContactConfirmation = vi.fn<(lead: unknown) => Promise<unknown>>(async () => ({ id: 'email_2' }))
vi.mock('@/lib/email', () => ({ sendContactNotification, sendContactConfirmation }))

const requestIp = vi.hoisted(() => ({ value: '203.0.113.7' }))
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': requestIp.value }) }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('submitContactForm', () => {
  beforeEach(() => {
    // Fresh module graph per test, so rate-limit counters start at zero.
    vi.resetModules()
    requestIp.value = '203.0.113.7'
    values.mockClear()
    insert.mockClear()
    sendContactNotification.mockClear()
    sendContactConfirmation.mockClear()
  })

  it('returns an error for invalid input without touching the database', async () => {
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(formDataFrom({ name: '', email: 'bad' }))

    expect(result.success).toBe(false)
    expect(insert).not.toHaveBeenCalled()
  })

  it('inserts the lead and sends both emails on valid input', async () => {
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(
      formDataFrom({ name: 'Jane', email: 'jane@example.com', company: 'Acme', message: 'Hi' })
    )

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Jane', email: 'jane@example.com' })
    )
    expect(sendContactNotification).toHaveBeenCalled()
    expect(sendContactConfirmation).toHaveBeenCalled()
  })

  it('logs a failed save, then still emails the enquiry to the team so it is not lost', async () => {
    values.mockRejectedValueOnce(Object.assign(new Error('relation "leads" does not exist'), { code: '42P01' }))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(formDataFrom({ name: 'Jane', email: 'jane@example.com', message: 'Hi' }))

    expect(result).toEqual({ success: true })
    expect(sendContactNotification).toHaveBeenCalledWith(expect.objectContaining({ email: 'jane@example.com', saved: false }))
    const logged = JSON.parse(String(error.mock.calls[0][0]))
    expect(logged).toMatchObject({ event: 'lead_save_error', kind: 'missing_table', emailedInstead: true })
    error.mockRestore()
  })

  it('tells the visitor to try again only when the enquiry was neither saved nor emailed', async () => {
    values.mockRejectedValueOnce(new Error('db down'))
    sendContactNotification.mockResolvedValueOnce(null) // email not configured
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(formDataFrom({ name: 'Jane', email: 'jane@example.com' }))

    expect(result.success).toBe(false)
    expect(JSON.parse(String(error.mock.calls[0][0]))).toMatchObject({ event: 'lead_save_error', emailedInstead: false })
    error.mockRestore()
  })

  it('keeps the saved lead and sends the confirmation even when the team notification fails, and logs it', async () => {
    sendContactNotification.mockRejectedValueOnce(new Error('domain is not verified'))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(formDataFrom({ name: 'Jane', email: 'jane@example.com' }))

    expect(result).toEqual({ success: true })
    expect(sendContactConfirmation).toHaveBeenCalled()
    expect(JSON.parse(String(error.mock.calls[0][0]))).toMatchObject({
      event: 'email_send_error',
      email: 'contact_notification',
      message: 'domain is not verified',
    })
    error.mockRestore()
  })

  it('silently drops a submission that filled the honeypot: reports success, saves nothing, emails nobody', async () => {
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(
      formDataFrom({ name: 'Bot', email: 'victim@example.com', website: 'http://spam.example' })
    )

    expect(result).toEqual({ success: true })
    expect(insert).not.toHaveBeenCalled()
    expect(sendContactConfirmation).not.toHaveBeenCalled()
  })

  it('limits each IP to 5 messages an hour', async () => {
    const { submitContactForm } = await import('./contact')
    for (let i = 0; i < 5; i++) {
      await submitContactForm(formDataFrom({ name: 'Jane', email: `jane${i}@example.com` }))
    }
    const result = await submitContactForm(formDataFrom({ name: 'Jane', email: 'jane9@example.com' }))

    expect(result).toEqual({ success: false, error: 'Too many messages. Please try again later.' })
    expect(insert).toHaveBeenCalledTimes(5)
  })

  it('sends at most 3 confirmations a day to one address, so the form cannot be used to spam someone', async () => {
    const { submitContactForm } = await import('./contact')
    for (let i = 0; i < 3; i++) {
      requestIp.value = `198.51.100.${i}`
      await submitContactForm(formDataFrom({ name: 'Jane', email: 'target@example.com' }))
    }
    requestIp.value = '198.51.100.50'
    const result = await submitContactForm(formDataFrom({ name: 'Jane', email: 'TARGET@example.com' }))

    expect(result.success).toBe(false)
    expect(sendContactConfirmation).toHaveBeenCalledTimes(3)
  })

  it('saves the "What would you like to automate?" answer at the top of the message', async () => {
    const { submitContactForm } = await import('./contact')
    await submitContactForm(formDataFrom({ name: 'Jane', email: 'jane@example.com', automate: 'Lead follow-ups', message: 'More detail.' }))
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ message: "What they'd like to automate: Lead follow-ups\n\nMore detail." })
    )
  })
})
