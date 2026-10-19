import { Section } from '@/components/ui/SectionHeader'
import { siteConfig } from '@/lib/site'
import { Reveal } from '@/components/motion/Reveal'

// Only facts the founder has confirmed; no headcount or client figures until they are.
const facts = [
  { label: 'What we focus on', value: 'Multi-agent systems' },
  { label: 'How we deliver', value: 'Full-stack delivery' },
  { label: 'Based in', value: siteConfig.location },
]

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <h2 id="about-title" className="text-lg font-semibold text-[var(--text-primary)]">
            Built by engineers who&apos;ve shipped real AI systems
          </h2>
          <blockquote className="mt-8 border-l-2 border-[var(--accent-purple)] pl-6 md:pl-8">
            <p className="text-[1.75rem] leading-[1.25] font-medium tracking-[-0.02em] text-[var(--text-primary)] md:text-[2.5rem]">
              &ldquo;We don&apos;t just talk about automation — we build it, test it, and stand behind it after
              launch.&rdquo;
            </p>
            <footer className="mt-6 text-[var(--text-muted)]">Founder &amp; CEO, Axonvia</footer>
          </blockquote>
        </Reveal>

        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-1">
          <p className="text-[var(--text-secondary)]">
            Axonvia was founded to close the gap between AI hype and AI that actually works in production. We&apos;re
            a team of engineers and builders who design agentic systems grounded in real business logic — not demos.
          </p>
          <dl className="mt-8 border-t border-[var(--rule)]">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-6 border-b border-[var(--rule)] py-3 text-[0.9375rem]">
                <dt className="text-[var(--text-muted)]">{fact.label}</dt>
                <dd className="text-right font-medium text-[var(--text-primary)]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
