import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { isProtectedRoute } from '@/lib/protected-routes'

export default auth((req) => {
  if (isProtectedRoute(req.nextUrl.pathname) && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
