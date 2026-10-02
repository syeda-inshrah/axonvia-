import { auth } from '@/auth'

export async function requireAdminUser() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('UNAUTHENTICATED')
  }
  return session.user
}
