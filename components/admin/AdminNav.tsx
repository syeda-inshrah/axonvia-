'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { SignOutButton } from '@/components/admin/SignOutButton'

const sections = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/faqs', label: 'FAQs' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="border-b border-[var(--border-glass)] bg-[var(--bg-secondary)] md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:py-6">
        <Link href="/admin/leads" className="flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
          <Logo className="h-7 w-7" />
          <span>
            Axonvia <span className="text-xs font-normal text-[var(--text-muted)]">Admin</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
        {sections.map((section) => {
          const active = pathname === section.href || pathname.startsWith(`${section.href}/`)
          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                active
                  ? 'bg-[var(--tint)] text-[var(--accent-cyan)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--tint)] hover:text-[var(--text-primary)]'
              }`}
            >
              {section.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-[var(--border-glass)] px-5 py-3 md:flex-col md:items-start md:p-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          View site <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
        <SignOutButton />
      </div>
    </aside>
  )
}
