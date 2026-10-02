import { describe, it, expect, vi, beforeEach } from 'vitest'

function makeChain(result: unknown) {
  const orderBy = vi.fn(async () => result)
  const where = vi.fn(() => ({ orderBy }))
  return { where, orderBy }
}

describe('content queries', () => {
  let from: ReturnType<typeof vi.fn>
  let select: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
  })

  it('getPublishedProjects filters by status=live and orders by sortOrder', async () => {
    const chain = makeChain([{ id: '1', name: 'RevenueOS' }])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { projects } = await import('@/lib/db/schema')
    const { getPublishedProjects } = await import('./content')
    const result = await getPublishedProjects()

    expect(from).toHaveBeenCalledWith(projects)
    expect(chain.where).toHaveBeenCalledTimes(1)
    expect(result).toEqual([{ id: '1', name: 'RevenueOS' }])
  })

  it('getPublishedProjects returns an empty array when the query throws', async () => {
    const where = vi.fn(() => ({ orderBy: vi.fn(async () => { throw new Error('boom') }) }))
    from = vi.fn(() => ({ where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { getPublishedProjects } = await import('./content')
    const result = await getPublishedProjects()

    expect(result).toEqual([])
  })

  it('getPublishedTestimonials queries the testimonials table', async () => {
    const chain = makeChain([])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { testimonials } = await import('@/lib/db/schema')
    const { getPublishedTestimonials } = await import('./content')
    await getPublishedTestimonials()

    expect(from).toHaveBeenCalledWith(testimonials)
  })

  it('getPublishedFaqs queries the faqs table', async () => {
    const chain = makeChain([])
    from = vi.fn(() => ({ where: chain.where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))

    const { faqs } = await import('@/lib/db/schema')
    const { getPublishedFaqs } = await import('./content')
    await getPublishedFaqs()

    expect(from).toHaveBeenCalledWith(faqs)
  })
})
