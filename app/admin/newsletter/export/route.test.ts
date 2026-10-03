import { describe, it, expect, vi, beforeEach } from 'vitest'

const requireAdminUser = vi.fn(async () => ({ id: 'admin1', email: 'admin@axonvia.example' }))
vi.mock('@/lib/require-admin', () => ({ requireAdminUser }))

const orderBy = vi.fn(async () => [
  { email: 'jane@example.com', status: 'subscribed', createdAt: new Date('2026-10-02T00:00:00Z') },
])
const from = vi.fn(() => ({ orderBy }))
const select = vi.fn(() => ({ from }))
vi.mock('@/lib/db', () => ({ db: { select } }))

describe('GET /admin/newsletter/export', () => {
  beforeEach(() => requireAdminUser.mockClear())

  it('returns 401 when not authenticated', async () => {
    requireAdminUser.mockRejectedValueOnce(new Error('UNAUTHENTICATED'))
    const { GET } = await import('./route')
    const response = await GET()

    expect(response.status).toBe(401)
  })

  it('returns a CSV body when authenticated', async () => {
    const { GET } = await import('./route')
    const response = await GET()
    const body = await response.text()

    expect(response.headers.get('Content-Type')).toBe('text/csv')
    expect(body).toContain('email,status,created_at')
    expect(body).toContain('jane@example.com,subscribed,')
  })
})
