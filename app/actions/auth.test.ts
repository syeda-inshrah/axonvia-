import { describe, it, expect, vi, beforeEach } from 'vitest'

class MockAuthError extends Error {}
vi.mock('next-auth', () => ({ AuthError: MockAuthError }))

const signIn = vi.fn()
const signOut = vi.fn()
vi.mock('@/auth', () => ({ signIn, signOut }))

function formDataFrom(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('signInAction', () => {
  beforeEach(() => signIn.mockReset())

  it('returns an error when fields are missing', async () => {
    const { signInAction } = await import('./auth')
    const result = await signInAction(formDataFrom({ email: '' }))

    expect(result.error).toBeDefined()
    expect(signIn).not.toHaveBeenCalled()
  })

  it('returns an error message when Auth.js rejects the credentials', async () => {
    signIn.mockRejectedValueOnce(new MockAuthError('Invalid credentials'))
    const { signInAction } = await import('./auth')
    const result = await signInAction(
      formDataFrom({ email: 'admin@axonvia.example', password: 'wrong' })
    )

    expect(result).toEqual({ error: 'Invalid email or password.' })
  })

  it('re-throws non-auth errors (e.g. the Auth.js redirect signal on success)', async () => {
    signIn.mockRejectedValueOnce(new Error('NEXT_REDIRECT'))
    const { signInAction } = await import('./auth')

    await expect(
      signInAction(formDataFrom({ email: 'admin@axonvia.example', password: 'right' }))
    ).rejects.toThrow('NEXT_REDIRECT')
  })
})

describe('signOutAction', () => {
  it('calls Auth.js signOut with a redirect to the login page', async () => {
    const { signOutAction } = await import('./auth')
    await signOutAction()

    expect(signOut).toHaveBeenCalledWith({ redirectTo: '/admin/login' })
  })
})
