// lib/admin-login.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const verifyAdminCredentials = vi.fn()
vi.mock('@/lib/auth-credentials', () => ({ verifyAdminCredentials }))

const user = { id: 'u1', email: 'admin@axonvia.example' }

describe('authorizeAdminLogin', () => {
  beforeEach(() => verifyAdminCredentials.mockReset())

  async function setup() {
    const { authorizeAdminLogin, createLoginThrottle } = await import('./admin-login')
    const throttle = createLoginThrottle()
    return { throttle, login: (email: string, ip = '203.0.113.7') => authorizeAdminLogin({ email, password: 'pw' }, ip, throttle) }
  }

  it('returns the admin user for valid credentials', async () => {
    verifyAdminCredentials.mockResolvedValue(user)
    const { login } = await setup()
    await expect(login('admin@axonvia.example')).resolves.toEqual(user)
  })

  it('locks an account after 5 failed attempts, without checking the password again, even from new IPs', async () => {
    verifyAdminCredentials.mockResolvedValue(null)
    const { login, throttle } = await setup()
    for (let i = 0; i < 5; i++) await expect(login('admin@axonvia.example', `198.51.100.${i}`)).resolves.toBeNull()

    verifyAdminCredentials.mockClear()
    verifyAdminCredentials.mockResolvedValue(user)
    await expect(login('ADMIN@axonvia.example', '192.0.2.99')).resolves.toBeNull()
    expect(verifyAdminCredentials).not.toHaveBeenCalled()
    expect(throttle.isBlocked('192.0.2.99', 'admin@axonvia.example')).toBe(true)
  })

  it('blocks an IP after 20 failures spread across different accounts', async () => {
    verifyAdminCredentials.mockResolvedValue(null)
    const { login, throttle } = await setup()
    for (let i = 0; i < 20; i++) await login(`guess${i}@axonvia.example`)
    expect(throttle.isBlocked('203.0.113.7', 'someone-new@axonvia.example')).toBe(true)
  })

  it('clears an account’s failure count after a successful sign-in', async () => {
    const { login } = await setup()
    verifyAdminCredentials.mockResolvedValue(null)
    for (let i = 0; i < 4; i++) await login('admin@axonvia.example')
    verifyAdminCredentials.mockResolvedValue(user)
    await login('admin@axonvia.example')

    verifyAdminCredentials.mockResolvedValue(null)
    for (let i = 0; i < 4; i++) await login('admin@axonvia.example')
    verifyAdminCredentials.mockResolvedValue(user)
    await expect(login('admin@axonvia.example')).resolves.toEqual(user)
  })
})
