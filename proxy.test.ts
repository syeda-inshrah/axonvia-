import { describe, it, expect } from 'vitest'
import { isProtectedRoute } from '@/lib/protected-routes'

describe('isProtectedRoute', () => {
  it('protects /admin and its subpaths', () => {
    expect(isProtectedRoute('/admin')).toBe(true)
    expect(isProtectedRoute('/admin/projects')).toBe(true)
  })

  it('does not protect /admin/login', () => {
    expect(isProtectedRoute('/admin/login')).toBe(false)
  })

  it('does not protect public routes', () => {
    expect(isProtectedRoute('/')).toBe(false)
    expect(isProtectedRoute('/dev/contact-test')).toBe(false)
  })
})
