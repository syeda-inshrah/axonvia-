// app/actions/unsubscribe.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const where = vi.fn(async () => {})
const set = vi.fn(() => ({ where }))
const update = vi.fn(() => ({ set }))
vi.mock('@/lib/db', () => ({ db: { update } }))

const verifyUnsubscribeToken = vi.fn()
vi.mock('@/lib/unsubscribe', () => ({ verifyUnsubscribeToken }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('unsubscribeNewsletter', () => {
  beforeEach(() => {
    update.mockClear()
    set.mockClear()
    verifyUnsubscribeToken.mockReset()
  })

  it('marks the subscriber unsubscribed when the link is valid', async () => {
    verifyUnsubscribeToken.mockReturnValue(true)
    const { unsubscribeNewsletter } = await import('./unsubscribe')
    const result = await unsubscribeNewsletter(formDataFrom({ email: 'Jane@Example.com', token: 't' }))

    expect(result).toEqual({ success: true })
    expect(set).toHaveBeenCalledWith({ status: 'unsubscribed' })
    expect(where).toHaveBeenCalled()
  })

  it('refuses an invalid or tampered link without touching the database', async () => {
    verifyUnsubscribeToken.mockReturnValue(false)
    const { unsubscribeNewsletter } = await import('./unsubscribe')
    const result = await unsubscribeNewsletter(formDataFrom({ email: 'jane@example.com', token: 'bad' }))

    expect(result.success).toBe(false)
    expect(update).not.toHaveBeenCalled()
  })
})
