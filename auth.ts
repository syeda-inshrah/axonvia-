import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authorizeAdminLogin } from '@/lib/admin-login'
import { clientIp } from '@/lib/client-ip'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const email = credentials?.email
        const password = credentials?.password
        if (typeof email !== 'string' || typeof password !== 'string') return null
        return authorizeAdminLogin({ email, password }, clientIp(request.headers))
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  // Admin sessions last one working day rather than Auth.js's 30-day default.
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
})
