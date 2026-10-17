// app/admin/page.test.tsx
import { describe, expect, it, vi } from 'vitest'

const redirect = vi.fn()
vi.mock('next/navigation', () => ({ redirect }))

describe('/admin', () => {
  it('sends a signed-in admin to the leads inbox (sign-in redirects here)', async () => {
    const { default: AdminHome } = await import('./page')
    AdminHome()
    expect(redirect).toHaveBeenCalledWith('/admin/leads')
  })
})
