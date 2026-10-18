import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

const differentiators = [
  { title: 'Built, Not Templated', description: 'Every system is custom-architected for your workflows — no generic chatbot wrappers.' },
  { title: 'Full-Stack Capability', description: 'From AI logic to production-grade web apps — one team, start to finish.' },
  { title: 'Transparent Process', description: 'Clear timelines, clear pricing, regular updates — no black box.' },
  { title: 'Long-Term Partnership', description: "We support and iterate on what we build — automation isn't a one-time deploy." },
]

export function WhyAxonvia() {
  return (
    <section className="px-5 md:px-10 py-24">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10">
        <Reveal>
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Why Axonvia</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
            Not Just Another AI Agency
          </h2>
          <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">
            We don&apos;t sell hype — we ship systems that work.
          </h3>
          <p className="mt-4 text-[var(--text-secondary)]">
            Every agent we build is tested against real business scenarios, not demos. We stay hands-on from
            strategy through to post-launch support.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {differentiators.map((item) => (
            <StaggerItem key={item.title}>
              <GlassCard glow={false} className="p-6! h-full hover:border-[var(--border-glow)]">
                <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
