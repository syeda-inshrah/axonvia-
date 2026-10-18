import { UserRound } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'

export function About() {
  return (
    <section id="about" className="px-5 md:px-10 py-24 section-alt">
      <Reveal className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 items-center">
        <div className="flex justify-center">
          {/* Placeholder until the founder photo is supplied: gradient ring + glow halo per spec §9. */}
          <div
            data-testid="founder-photo-placeholder"
            aria-hidden="true"
            className="rounded-full bg-[image:var(--accent-gradient)] p-[2px] shadow-[0_0_60px_var(--glow)]"
          >
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[var(--bg-card)]">
              <UserRound className="h-20 w-20 text-[var(--text-muted)]" strokeWidth={1.25} />
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">About Axonvia</span>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--text-primary)]">
            Built by Engineers Who&apos;ve Shipped Real AI Systems
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Axonvia was founded to close the gap between AI hype and AI that actually works in production. We&apos;re
            a team of engineers and builders who design agentic systems grounded in real business logic — not
            demos.
          </p>

          <blockquote className="mt-6 border-l-2 border-[var(--accent-cyan)] pl-4 italic text-lg text-[var(--text-primary)]">
            &quot;We don&apos;t just talk about automation — we build it, test it, and stand behind it after
            launch.&quot;
            <footer className="mt-2 text-sm text-[var(--text-muted)]">— Founder &amp; CEO, Axonvia</footer>
          </blockquote>

          <div className="mt-6 flex gap-6 text-sm text-[var(--text-secondary)]">
            <span>Multi-agent systems</span>
            <span>Full-stack delivery</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
