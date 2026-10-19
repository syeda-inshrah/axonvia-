import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

// Shell for standalone pages (legal, 404): brand header, a way home, centred content.
export function SimplePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden px-5 md:px-10">
      <header className="relative z-10 mx-auto flex h-20 max-w-[1320px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold text-[var(--text-primary)]">
          <Logo className="h-7 w-7" />
          Axonvia
        </Link>
        <Link
          href="/"
          className="link-underline flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to home
        </Link>
      </header>
      <main className="relative z-10 mx-auto max-w-2xl py-20 md:py-28">{children}</main>
    </div>
  )
}
