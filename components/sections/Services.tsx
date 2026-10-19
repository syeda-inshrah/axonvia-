import { Bot, Compass, Database, Layers, MessageCircle, Workflow } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

// Footer's service links mirror these titles.
const services = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic.',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'End-to-end automation of repetitive operations — from data entry to multi-step approval chains.',
  },
  {
    icon: Layers,
    title: 'AI-Powered Products',
    description: 'Full web applications with AI at the core, built and shipped from MVP to production.',
  },
  {
    icon: MessageCircle,
    title: 'Conversational AI & Chatbots',
    description: 'Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools.',
  },
  {
    icon: Database,
    title: 'Data & Integration',
    description: 'Connecting your tools, CRMs, and databases into one automated pipeline.',
  },
  {
    icon: Compass,
    title: 'AI Strategy & Consulting',
    description: 'Helping teams identify where AI delivers real ROI before a single line of code is written.',
  },
]

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeader
        id="services-title"
        title="AI systems built around your business"
        subtitle="From a single automated workflow to a full agentic system — we build what actually moves the needle."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {services.map((service) => (
          <div data-reveal key={service.title} className="h-full">
            <SpotlightCard className="group h-full p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tint)] text-[var(--accent-cyan)] ring-1 ring-[var(--tint-strong)] transition-colors duration-300 group-hover:bg-[image:var(--accent-gradient)] group-hover:text-white group-hover:ring-transparent">
                <service.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{service.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">{service.description}</p>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </Section>
  )
}
