import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Aurora } from '@/components/motion/Aurora'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

// Shell for standalone pages (legal, 404, unsubscribe): a short navy band carrying the brand and the same
// drifting light as the home hero, then the page's content on a card that overlaps the band and rises in.
export function SimplePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24">
      <div className="on-ink relative isolate h-64 overflow-hidden bg-[var(--ink-panel)] px-5 md:h-72 md:px-10">
        <Aurora />
        <div aria-hidden="true" className="dot-grid absolute inset-0" />
        <header className="relative mx-auto flex h-20 max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.02em] text-white">
            <Logo className="h-7 w-7" />
            Axonvia
          </Link>
          <Link
            href="/"
            className="link-underline flex items-center gap-1.5 text-sm text-[var(--on-ink-soft)] hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to home
          </Link>
        </header>
      </div>

      <main className="relative z-10 mx-auto -mt-36 max-w-[46rem] px-5 md:-mt-40">
        <div
          data-reveal
          className="rounded-3xl border border-[var(--rule)] bg-[var(--bg-card)] p-8 shadow-[var(--shadow-raised)] md:p-12"
        >
          {children}
        </div>
      </main>
      <ScrollReveals />
    </div>
  )
}
