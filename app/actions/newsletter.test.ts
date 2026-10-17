import { describe, it, expect, vi, beforeEach } from 'vitest'

const onConflictDoUpdate = vi.fn(async () => {})
const values = vi.fn(() => ({ onConflictDoUpdate }))
const insert = vi.fn(() => ({ values }))
vi.mock('@/lib/db', () => ({ db: { insert } }))

const sendNewsletterWelcome = vi.fn(async () => {})
vi.mock('@/lib/email', () => ({ sendNewsletterWelcome }))

const requestIp = vi.hoisted(() => ({ value: '203.0.113.7' }))
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': requestIp.value }) }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('subscribeNewsletter', () => {
  beforeEach(() => {
    vi.resetModules()
    requestIp.value = '203.0.113.7'
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

  it('silently drops a submission that filled the honeypot', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    const result = await subscribeNewsletter(formDataFrom({ email: 'victim@example.com', website: 'x' }))

    expect(result).toEqual({ success: true })
    expect(values).not.toHaveBeenCalled()
    expect(sendNewsletterWelcome).not.toHaveBeenCalled()
  })

  it('limits each IP to 10 signups an hour', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    for (let i = 0; i < 10; i++) await subscribeNewsletter(formDataFrom({ email: `reader${i}@example.com` }))
    const result = await subscribeNewsletter(formDataFrom({ email: 'reader99@example.com' }))

    expect(result).toEqual({ success: false, error: 'Too many signups. Please try again later.' })
    expect(sendNewsletterWelcome).toHaveBeenCalledTimes(10)
  })

  it('sends at most 3 welcome emails a day to one address', async () => {
    const { subscribeNewsletter } = await import('./newsletter')
    for (let i = 0; i < 4; i++) {
      requestIp.value = `198.51.100.${i}`
      await subscribeNewsletter(formDataFrom({ email: 'target@example.com' }))
    }
    expect(sendNewsletterWelcome).toHaveBeenCalledTimes(3)
  })
})
