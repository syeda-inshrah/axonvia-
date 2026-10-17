import { describe, it, expect, vi, beforeEach } from 'vitest'
import { leads } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const orderBy = vi.fn(async () => [{ id: '1', name: 'Jane', status: 'new' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const updateWhere = vi.fn(async () => {})
const set = vi.fn(() => ({ where: updateWhere }))
const update = vi.fn(() => ({ set }))
vi.mock('@/lib/db', () => ({ db: { select, update } }))

describe('lead admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    set.mockClear()
    updateWhere.mockClear()
  })

  it('listLeadsForAdmin requires an admin and returns all rows ordered by newest first', async () => {
    const { listLeadsForAdmin } = await import('./leads')
    const result = await listLeadsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(leads)
    expect(result).toEqual([{ id: '1', name: 'Jane', status: 'new' }])
  })

  it('updateLeadStatus rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { updateLeadStatus } = await import('./leads')
    const result = await updateLeadStatus('1', 'contacted')

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(set).not.toHaveBeenCalled()
  })

  it('updateLeadStatus updates status when authenticated', async () => {
    const { updateLeadStatus } = await import('./leads')
    const result = await updateLeadStatus('1', 'contacted')

    expect(result).toEqual({ success: true })
    expect(set).toHaveBeenCalledWith({ status: 'contacted' })
  })

  it('refreshes the leads list after a status change', async () => {
    revalidatePath.mockClear()
    const { updateLeadStatus } = await import('./leads')
    await updateLeadStatus('1', 'contacted')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/leads')
  })
})
