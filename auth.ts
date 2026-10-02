import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verifyAdminCredentials } from '@/lib/auth-credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        if (typeof email !== 'string' || typeof password !== 'string') return null
        return verifyAdminCredentials(email, password)
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
})
