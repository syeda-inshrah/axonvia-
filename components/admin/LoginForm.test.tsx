// components/admin/LoginForm.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const signInAction = vi.fn()
vi.mock('@/app/actions/auth', () => ({ signInAction }))

describe('LoginForm', () => {
  beforeEach(() => signInAction.mockReset())

  it('shows the error the server returns (wrong password, lockout) instead of failing silently', async () => {
    signInAction.mockResolvedValue({ error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' })
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@axonvia.example' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Too many sign-in attempts'))
  })

  it('keeps the typed email after a failed sign-in, so only the password needs retyping', async () => {
    signInAction.mockResolvedValue({ error: 'Invalid email or password.' })
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@axonvia.example' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.'))
    expect(screen.getByLabelText('Email')).toHaveValue('admin@axonvia.example')
  })
})
