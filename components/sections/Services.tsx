import { Bot, Compass, Database, Layers, MessageCircle, Workflow } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { TiltCard } from '@/components/ui/TiltCard'

// Footer's service links mirror these titles. `span` places each card in the bento grid: the feature card takes
// a 2x2 block, four cards fill the space beside it, and the last runs the full width beneath.
const services = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle lead qualification, customer queries, scheduling, and more — trained on your business logic.',
    span: 'sm:col-span-2 lg:col-span-4 lg:row-span-2',
    feature: true,
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'End-to-end automation of repetitive operations — from data entry to multi-step approval chains.',
    span: 'lg:col-span-2',
  },
  {
    icon: Layers,
    title: 'AI-Powered Products',
    description: 'Full web applications with AI at the core, built and shipped from MVP to production.',
    span: 'lg:col-span-2',
  },
  {
    icon: MessageCircle,
    title: 'Conversational AI & Chatbots',
    description: 'Intelligent chat and voice interfaces integrated into WhatsApp, websites, and internal tools.',
    span: 'lg:col-span-2',
  },
  {
    icon: Database,
    title: 'Data & Integration',
    description: 'Connecting your tools, CRMs, and databases into one automated pipeline.',
    span: 'lg:col-span-2',
  },
  {
    icon: Compass,
    title: 'AI Strategy & Consulting',
    description: 'Helping teams identify where AI delivers real ROI before a single line of code is written.',
    span: 'sm:col-span-2 lg:col-span-8',
    wide: true,
  },
]

// The feature card's illustration: a request flowing through an agent's tools, drawn as a quiet pipeline.
function PipelineArt() {
  const stops = ['Request', 'Agent', 'CRM', 'Calendar', 'Reply']
  return (
    <div aria-hidden="true" className="mt-10 rounded-2xl border border-[var(--rule)] bg-[var(--bg-primary)] p-5 lg:mt-auto">
      <div className="relative flex items-center justify-between gap-2">
        <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-[image:var(--accent-gradient)] opacity-40" />
        <div className="pipeline-pulse absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_12px_rgba(45,91,255,0.8)]" />
        {stops.map((stop, i) => (
          <span
            key={stop}
            className={`relative rounded-full border px-2 py-1 text-[0.6875rem] font-medium sm:px-3 sm:text-xs ${stop === 'Calendar' ? 'hidden sm:inline' : ''} ${
              i === 1
                ? 'border-transparent bg-[image:var(--accent-gradient)] text-white'
                : 'border-[var(--rule)] bg-white text-[var(--text-secondary)]'
            }`}
          >
            {stop}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeader
        id="services-title"
        title="AI systems built around your business"
        subtitle="From a single automated workflow to a full agentic system — we build what actually moves the needle."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-8">
        {services.map((service) => (
          <div key={service.title} data-reveal className={service.span}>
            <TiltCard className={service.feature ? 'p-8 md:p-10' : 'p-7'}>
              <div className={service.wide ? 'md:flex md:items-center md:gap-8' : ''}>
                <span
                  className={`flex shrink-0 items-center justify-center rounded-2xl bg-[image:var(--accent-gradient)] text-white shadow-[0_10px_24px_-10px_rgba(45,91,255,0.7)] ${
                    service.feature ? 'h-14 w-14' : 'h-11 w-11'
                  }`}
                >
                  <service.icon aria-hidden="true" className={service.feature ? 'h-6 w-6' : 'h-5 w-5'} />
                </span>
                <div className={service.wide ? 'md:flex md:flex-1 md:items-baseline md:justify-between md:gap-10' : ''}>
                  <h3
                    className={`font-semibold text-[var(--text-primary)] ${
                      service.feature ? 'mt-6 text-3xl md:text-4xl' : service.wide ? 'mt-6 text-xl md:mt-0' : 'mt-6 text-xl'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-3 leading-relaxed text-[var(--text-secondary)] ${
                      service.feature ? 'max-w-[28rem] text-lg' : service.wide ? 'text-[0.9375rem] md:mt-0 md:max-w-[32rem]' : 'text-[0.9375rem]'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
              {service.feature && <PipelineArt />}
            </TiltCard>
          </div>
        ))}
      </div>
    </Section>
  )
}
