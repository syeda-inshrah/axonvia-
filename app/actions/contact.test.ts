import { describe, it, expect, vi, beforeEach } from 'vitest'

const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendContactNotification = vi.fn(async () => {})
const sendContactConfirmation = vi.fn(async () => {})
vi.mock('@/lib/email', () => ({ sendContactNotification, sendContactConfirmation }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('submitContactForm', () => {
  beforeEach(() => {
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

  it('returns an error when the database insert throws', async () => {
    values.mockRejectedValueOnce(new Error('db down'))
    const { submitContactForm } = await import('./contact')
    const result = await submitContactForm(
      formDataFrom({ name: 'Jane', email: 'jane@example.com' })
    )

    expect(result.success).toBe(false)
  })
})
