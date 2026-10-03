import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const signOutAction = vi.fn()
vi.mock('@/app/actions/auth', () => ({ signOutAction }))

describe('SignOutButton', () => {
  it('calls signOutAction when clicked', async () => {
    const { SignOutButton } = await import('./SignOutButton')
    render(<SignOutButton />)

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(signOutAction).toHaveBeenCalled()
  })
})
