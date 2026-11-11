import type { Viewport } from 'next'
import { LoginScreen } from '@/components/admin/LoginScreen'

// The sign-in screen is dark navy, so the mobile browser bar matches it instead of the site's light theme.
export const viewport: Viewport = { themeColor: '#050B1F', colorScheme: 'dark' }

export default function AdminLoginPage() {
  return <LoginScreen />
}
