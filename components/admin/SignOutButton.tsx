'use client'

import { signOutAction } from '@/app/actions/auth'

export function SignOutButton() {
  return <button onClick={() => signOutAction()}>Sign out</button>
}
