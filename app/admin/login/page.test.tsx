// app/admin/login/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AdminLoginPage, { viewport } from './page'

vi.mock('@/app/actions/auth', () => ({ signInAction: vi.fn() }))

describe('AdminLoginPage', () => {
  it('shows the Axonvia brand, one "Sign in" heading and the login form inside the main landmark', () => {
    render(<AdminLoginPage />)
    const main = screen.getByRole('main')
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument()
    expect(main).toHaveTextContent('Axonvia')
    expect(main.querySelector('svg')).not.toBeNull() // the logo mark
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('keeps the background orbs decorative and out of the accessibility tree', () => {
    const { container } = render(<AdminLoginPage />)
    const orbs = container.querySelectorAll('[data-login-orb]')
    expect(orbs.length).toBeGreaterThan(0)
    for (const orb of orbs) expect(orb.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('tints the mobile browser bar navy to match the dark page', () => {
    expect(viewport).toMatchObject({ themeColor: '#050B1F', colorScheme: 'dark' })
  })
})
