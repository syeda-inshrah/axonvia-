import { Section, SectionHeader } from '@/components/ui/SectionHeader'

// Footer's service links mirror these titles.
const services = [
  {
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic.',
  },
  {
    title: 'Workflow Automation',
    description: 'End-to-end automation of repetitive operations — from data entry to multi-step approval chains.',
  },
  {
    title: 'AI-Powered Products',
    description: 'Full web applications with AI at the core, built and shipped from MVP to production.',
  },
  {
    title: 'Conversational AI & Chatbots',
    description: 'Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools.',
  },
  {
    title: 'Data & Integration',
    description: 'Connecting your tools, CRMs, and databases into one automated pipeline.',
  },
  {
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

      <ul className="mt-16 border-b border-[var(--rule)] md:mt-20">
        {services.map((service) => (
          <li
            key={service.title}
            className="grid grid-cols-1 gap-2 border-t border-[var(--rule)] py-7 md:grid-cols-12 md:gap-10 md:py-9"
          >
            <h3 className="text-xl font-semibold text-[var(--text-primary)] md:col-span-5 md:text-2xl">
              {service.title}
            </h3>
            <p className="max-w-[34rem] text-[var(--text-secondary)] md:col-span-6 md:col-start-7 md:pt-1">
              {service.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
