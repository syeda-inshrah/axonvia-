'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { headers } from 'next/headers'
import { loginThrottle } from '@/lib/admin-login'
import { clientIp } from '@/lib/client-ip'

export async function signInAction(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (loginThrottle.isBlocked(clientIp(await headers()), email)) {
    return { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw error
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/admin/login' })
}
