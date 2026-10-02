import { describe, it, expect, vi, beforeEach } from 'vitest'

const onConflictDoUpdate = vi.fn(async () => {})
const values = vi.fn(() => ({ onConflictDoUpdate }))
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendNewsletterWelcome = vi.fn(async () => {})
vi.mock('@/lib/email', () => ({ sendNewsletterWelcome }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('subscribeNewsletter', () => {
  beforeEach(() => {
    onConflictDoUpdate.mockClear()
    values.mockClear()
    sendNewsletterWelcome.mockClear()
  })

  it('returns an error for an invalid email', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'nope' }))

    expect(result.success).toBe(false)
    expect(values).not.toHaveBeenCalled()
  })

  it('upserts the subscriber and sends a welcome email on valid input', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'jane@example.com' }))

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith({ email: 'jane@example.com', status: 'subscribed' })
    expect(onConflictDoUpdate).toHaveBeenCalled()
    expect(sendNewsletterWelcome).toHaveBeenCalledWith('jane@example.com')
  })

  it('returns an error when the database upsert throws', async () => {
    onConflictDoUpdate.mockRejectedValueOnce(new Error('db down'))
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'jane@example.com' }))

    expect(result.success).toBe(false)
  })
})
