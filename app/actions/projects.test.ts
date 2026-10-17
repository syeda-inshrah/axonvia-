import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projects } from '@/lib/db/schema'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const orderBy = vi.fn(async () => [{ id: '1', name: 'RevenueOS' }])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
const values = vi.fn(async () => {})
const insert = vi.fn(() => ({ values }))
const updateWhere = vi.fn(async () => {})
const set = vi.fn(() => ({ where: updateWhere }))
const update = vi.fn(() => ({ set }))
const deleteWhere = vi.fn(async () => {})
const del = vi.fn(() => ({ where: deleteWhere }))
vi.mock('@/lib/db', () => ({ db: { select, insert, update, delete: del } }))

const baseInput = {
  name: 'RevenueOS',
  description: 'desc',
  stats: [],
  tags: [],
  imageUrl: null,
  link: null,
  isFeatured: false,
  status: 'coming_soon' as const,
  sortOrder: 0,
}

describe('project admin actions', () => {
  beforeEach(() => {
    requireAdminUser.mockClear()
    values.mockClear()
    updateWhere.mockClear()
    deleteWhere.mockClear()
  })

  it('listProjectsForAdmin requires an admin and returns all rows', async () => {
    const { listProjectsForAdmin } = await import('./projects')
    const result = await listProjectsForAdmin()

    expect(requireAdminUser).toHaveBeenCalled()
    expect(from).toHaveBeenCalledWith(projects)
    expect(result).toEqual([{ id: '1', name: 'RevenueOS' }])
  })

  it('createProject rejects when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { createProject } = await import('./projects')
    const result = await createProject(baseInput)

    expect(result).toEqual({ success: false, error: 'Not authenticated' })
    expect(values).not.toHaveBeenCalled()
  })

  it('createProject inserts when authenticated', async () => {
    const { createProject } = await import('./projects')
    const result = await createProject(baseInput)

    expect(result).toEqual({ success: true })
    expect(values).toHaveBeenCalledWith(baseInput)
  })

  it('deleteProject deletes by id when authenticated', async () => {
    const { deleteProject } = await import('./projects')
    const result = await deleteProject('1')

    expect(result).toEqual({ success: true })
    expect(deleteWhere).toHaveBeenCalled()
  })

  it('refreshes the admin list and the homepage after a change', async () => {
    revalidatePath.mockClear()
    const { createProject, updateProject, deleteProject } = await import('./projects')
    await createProject(baseInput)
    await updateProject('1', { status: 'live' })
    await deleteProject('1')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/projects')
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledTimes(6)
  })

  it('rejects a project link that is not an http(s) URL, so no script URL can reach the public page', async () => {
    values.mockClear()
    const { createProject, updateProject } = await import('./projects')
    const created = await createProject({ ...baseInput, link: 'javascript:alert(1)' })
    const updated = await updateProject('1', { link: 'javascript:alert(1)' })

    expect(created.success).toBe(false)
    expect(updated.success).toBe(false)
    expect(values).not.toHaveBeenCalled()
    expect(updateWhere).not.toHaveBeenCalled()
  })

  it('rejects a project without a name', async () => {
    const { createProject } = await import('./projects')
    expect((await createProject({ ...baseInput, name: '  ' })).success).toBe(false)
  })
})
