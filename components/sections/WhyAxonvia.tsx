import { Eye, Handshake, Layers, PenTool } from 'lucide-react'
import { Section } from '@/components/ui/SectionHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const differentiators = [
  { icon: PenTool, title: 'Built, Not Templated', description: 'Every system is custom-architected for your workflows — no generic chatbot wrappers.' },
  { icon: Layers, title: 'Full-Stack Capability', description: 'From AI logic to production-grade web apps — one team, start to finish.' },
  { icon: Eye, title: 'Transparent Process', description: 'Clear timelines, clear pricing, regular updates — no black box.' },
  { icon: Handshake, title: 'Long-Term Partnership', description: "We support and iterate on what we build — automation isn't a one-time deploy." },
]

export function WhyAxonvia() {
  return (
    <Section wash labelledBy="why-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="lg:col-span-5 lg:pt-2">
          <h2 id="why-title" className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:text-[2.75rem]">
            Not just another AI agency
          </h2>
          <p className="mt-6 text-xl font-medium leading-snug text-[var(--text-primary)]">
            We don&apos;t sell hype — we ship systems that work.
          </p>
          <p className="mt-4 max-w-[30rem] text-[var(--text-secondary)]">
            Every agent we build is tested against real business scenarios, not demos. We stay hands-on from strategy
            through to post-launch support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
          {differentiators.map((item) => (
            <div data-reveal key={item.title} className="h-full">
              <SpotlightCard className="h-full p-6">
                <item.icon aria-hidden="true" className="h-5 w-5 text-[var(--accent-purple)]" />
                <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-[var(--text-secondary)]">{item.description}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
