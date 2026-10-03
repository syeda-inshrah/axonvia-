import { describe, it, expect, vi, beforeEach } from 'vitest'
import { faqs } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [{ id: '1', question: 'What do you do?' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, delete: del } }))

const baseInput = {
  question: 'What do you do?',
  answer: 'We build AI agents.',
  isPublished: true,
  sortOrder: 0,
}

describe('faq admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    deleteWhere.mockClear()
  })

  it('listFaqsForAdmin requires an admin and returns all rows', async () => {
    const { listFaqsForAdmin } = await import('./faqs')
    const result = await listFaqsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(faqs)
    expect(result).toEqual([{ id: '1', question: 'What do you do?' }])
  })

  it('createFaq rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createFaq } = await import('./faqs')
    const result = await createFaq(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createFaq inserts when authenticated', async () => {
    const { createFaq } = await import('./faqs')
    const result = await createFaq(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteFaq deletes by id when authenticated', async () => {
    const { deleteFaq } = await import('./faqs')
    const result = await deleteFaq('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })
})
