import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

// Shell for standalone pages (legal, 404, unsubscribe): the homepage's ambient light and grid, the brand, a way
// home, and the page's content on a glass card that rises in.
export function SimplePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen px-5 pb-24 md:px-10">
      <AmbientBackground />
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh]" />
      <header className="mx-auto flex h-20 max-w-[1200px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
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

      <main className="mx-auto max-w-[46rem] pt-12 md:pt-20">
        <div
          data-reveal
          className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-[var(--shadow-raised)] backdrop-blur-xl md:p-12"
        >
          {children}
        </div>
      </main>
      <ScrollReveals />
    </div>
  )
}
