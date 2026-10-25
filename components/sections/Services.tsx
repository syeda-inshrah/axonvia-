import { Bot, Check, Inbox, LayoutDashboard, Network, Workflow, type LucideIcon } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { TiltCard } from '@/components/ui/TiltCard'
import { services } from '@/lib/site'

// One line icon per service, in the order of `services` (lib/site.ts).
const ICONS: Record<(typeof services)[number]['slug'], LucideIcon> = {
  'process-automation': Workflow,
  'lead-management': Inbox,
  'ai-agents': Bot,
  'custom-software': LayoutDashboard,
  integration: Network,
}

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeader
        id="services-title"
        title="What we build"
        subtitle="From a single automated workflow to a complete AI system, built around your business."
      />

      {/* 3 + 2 on desktop with the second row centred, 2 per row on tablets, stacked on phones. */}
      <ul className="mt-14 flex flex-wrap justify-center gap-5 md:mt-16">
        {services.map((service) => {
          const Icon = ICONS[service.slug]
          return (
            <li
              key={service.slug}
              data-reveal
              className="w-full md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <TiltCard className="p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--accent-gradient)] text-white shadow-[0_10px_24px_-10px_rgba(45,91,255,0.7)]">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{service.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">{service.description}</p>
                <ul className="mt-5 space-y-2 border-t border-[var(--rule)] pt-5">
                  {service.examples.map((example) => (
                    <li key={example} className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-cyan)]" />
                      {example}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
