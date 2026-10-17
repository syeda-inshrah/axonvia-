'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'

// The login page shares the /admin layout but must not show the dashboard navigation.
export function AdminShell({ children }: { children: React.ReactNode }) {
  if (usePathname() === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] md:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
