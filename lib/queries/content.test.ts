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

  it('getPublishedTestimonials keeps the page up when the table is missing, but logs the migration problem plainly', async () => {
    const missing = Object.assign(new Error('relation "testimonials" does not exist'), { code: '42P01' })
    const where = vi.fn(() => ({ orderBy: vi.fn(async () => { throw missing }) }))
    from = vi.fn(() => ({ where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { getPublishedTestimonials } = await import('./content')
    expect(await getPublishedTestimonials()).toEqual([])

    const entry = JSON.parse(errorLog.mock.calls[0][0] as string)
    expect(entry).toMatchObject({ event: 'db_query_error', query: 'getPublishedTestimonials', kind: 'missing_table', code: '42P01' })
    expect(entry.hint).toMatch(/npm run db:migrate/)
    errorLog.mockRestore()
  })

  it('getPublishedTestimonials reports a temporary outage as such, not as a schema problem', async () => {
    const where = vi.fn(() => ({ orderBy: vi.fn(async () => { throw new TypeError('fetch failed') }) }))
    from = vi.fn(() => ({ where }))
    select = vi.fn(() => ({ from }))
    vi.doMock('@/lib/db', () => ({ db: { select } }))
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { getPublishedTestimonials } = await import('./content')
    expect(await getPublishedTestimonials()).toEqual([])
    expect(JSON.parse(errorLog.mock.calls[0][0] as string)).toMatchObject({ kind: 'unavailable' })
    errorLog.mockRestore()
  })

  it('on a missing table, also logs what the runtime connection sees, once, without credentials', async () => {
    const missing = Object.assign(new Error('relation "projects" does not exist'), { code: '42P01' })
    const where = vi.fn(() => ({ orderBy: vi.fn(async () => { throw missing }) }))
    from = vi.fn(() => ({ where }))
    select = vi.fn(() => ({ from }))
    const execute = vi.fn(async (): Promise<{ rows: unknown[] }> => ({ rows: [] }))
    execute
      .mockResolvedValueOnce({ rows: [{ database: 'neondb', role: 'app', search_path: '"$user", public', schemas: ['public'] }] })
      .mockResolvedValueOnce({ rows: [] })
    vi.doMock('@/lib/db', () => ({ db: { select, execute } }))
    vi.stubEnv('DATABASE_URL', 'postgresql://app:s3cret@ep-x-pooler.neon.tech/neondb')
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { getPublishedProjects } = await import('./content')
    await getPublishedProjects()
    await getPublishedProjects()

    const lines = errorLog.mock.calls.map((call) => JSON.parse(call[0] as string))
    const identities = lines.filter((line) => line.event === 'db_connection_identity')
    expect(identities).toHaveLength(1)
    expect(identities[0]).toMatchObject({ host: 'ep-x-pooler.neon.tech', database: 'neondb', role: 'app', pooled: true })
    expect(identities[0].verdict).toMatch(/None of the app's tables exist in database "neondb"/)
    expect(errorLog.mock.calls.flat().join(' ')).not.toContain('s3cret')
    errorLog.mockRestore()
    vi.unstubAllEnvs()
  })
})
