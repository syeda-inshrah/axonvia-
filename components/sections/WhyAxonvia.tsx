import { Eye, Handshake, Layers, PenTool } from 'lucide-react'
import { Section } from '@/components/ui/SectionHeader'
import { TiltCard } from '@/components/ui/TiltCard'
import { ScrollStatement } from '@/components/motion/ScrollStatement'

const differentiators = [
  { icon: PenTool, title: 'Built, Not Templated', description: 'Every system is custom-architected for your workflows — no generic chatbot wrappers.' },
  { icon: Layers, title: 'Full-Stack Capability', description: 'From AI logic to production-grade web apps — one team, start to finish.' },
  { icon: Eye, title: 'Transparent Process', description: 'Clear timelines, clear pricing, regular updates — no black box.' },
  { icon: Handshake, title: 'Long-Term Partnership', description: "We support and iterate on what we build — automation isn't a one-time deploy." },
]

const STATEMENT =
  'We don’t sell hype — we ship systems that work. Every agent we build is tested against real business scenarios, not demos, and we stay hands-on from strategy through to post-launch support.'

export function WhyAxonvia() {
  return (
    <Section labelledBy="why-title">
      <h2 id="why-title" data-reveal className="text-sm font-medium text-[var(--accent-purple)]">
        Not just another AI agency
      </h2>
      <ScrollStatement
        text={STATEMENT}
        className="mt-6 max-w-[22ch] font-serif text-[clamp(2.1rem,4.6vw,4rem)] leading-[1.08] tracking-[-0.01em] text-[var(--text-primary)] sm:max-w-[26ch]"
      />

      <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {differentiators.map((item) => (
          <li key={item.title} data-reveal>
            <TiltCard className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tint-violet)] text-[var(--accent-purple)]">
                <item.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-[var(--text-secondary)]">{item.description}</p>
            </TiltCard>
          </li>
        ))}
      </ul>
    </Section>
  )
}
