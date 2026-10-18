'use client'

import { signOutAction } from '@/app/actions/auth'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOutAction()}
      className="w-fit text-left text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--danger)]"
    >
      Sign out
    </button>
  )
}
