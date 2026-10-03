import { describe, it, expect, vi, beforeEach } from 'vitest'
import { newsletterSubscribers } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', email: 'jane@example.com', status: 'subscribed' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

describe('listSubscribersForAdmin', () => {
  beforeEach(() => requireAdminUser.mockClear())

  it('requires an admin and returns all subscribers newest first', async () => {
    const { listSubscribersForAdmin } = await import('./subscribers')
    const result = await listSubscribersForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(newsletterSubscribers)
    expect(result).toEqual([{ id: '1', email: 'jane@example.com', status: 'subscribed' }])
  })
})
