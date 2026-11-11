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

  it('lets the visitor show and hide the password with a labelled toggle', async () => {
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)
    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')

    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(toggle).toHaveAttribute('type', 'button') // never submits the form
    fireEvent.click(toggle)
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(password).toHaveAttribute('type', 'password')
  })

  it('shows a busy, disabled button while signing in, then re-enables it on failure', async () => {
    let finish: (value: { error: string }) => void = () => {}
    signInAction.mockReturnValue(new Promise((resolve) => (finish = resolve)))
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@axonvia.example' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    const busy = await screen.findByRole('button', { name: 'Signing in…' })
    expect(busy).toBeDisabled()
    expect(busy).toHaveAttribute('aria-busy', 'true')
    finish({ error: 'Invalid email or password.' })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled())
  })

  it('sends the email and password exactly as typed to the sign-in action', async () => {
    signInAction.mockResolvedValue({ error: 'Invalid email or password.' })
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@axonvia.example' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: ' secret with spaces ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(signInAction).toHaveBeenCalledTimes(1))
    const sent = signInAction.mock.calls[0][0] as FormData
    expect(sent.get('email')).toBe('admin@axonvia.example')
    expect(sent.get('password')).toBe(' secret with spaces ')
  })
})
