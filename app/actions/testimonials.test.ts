import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testimonials } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const orderBy = vi.fn(async () => [{ id: '1', quote: 'Great work' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, delete: del } }))

const baseInput = {
  quote: 'Great work',
  clientName: 'Jane',
  clientRole: 'CEO',
  avatarUrl: null,
  isPublished: false,
  sortOrder: 0,
}

describe('testimonial admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    deleteWhere.mockClear()
  })

  it('listTestimonialsForAdmin requires an admin and returns all rows', async () => {
    const { listTestimonialsForAdmin } = await import('./testimonials')
    const result = await listTestimonialsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(testimonials)
    expect(result).toEqual([{ id: '1', quote: 'Great work' }])
  })

  it('createTestimonial rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createTestimonial } = await import('./testimonials')
    const result = await createTestimonial(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createTestimonial inserts when authenticated', async () => {
    const { createTestimonial } = await import('./testimonials')
    const result = await createTestimonial(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteTestimonial deletes by id when authenticated', async () => {
    const { deleteTestimonial } = await import('./testimonials')
    const result = await deleteTestimonial('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })

  it('refreshes the admin list and the homepage after a change', async () => {
    revalidatePath.mockClear()
    const { createTestimonial } = await import('./testimonials')
    await createTestimonial(baseInput)
    expect(revalidatePath).toHaveBeenCalledWith('/admin/testimonials')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('rejects an avatar URL that is not http(s)', async () => {
    values.mockClear()
    const { createTestimonial } = await import('./testimonials')
    const result = await createTestimonial({ ...baseInput, avatarUrl: 'data:text/html,hi' })
    expect(result.success).toBe(false)
    expect(values).not.toHaveBeenCalled()
  })
})
