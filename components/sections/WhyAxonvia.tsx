import { Section } from '@/components/ui/SectionHeader'

const differentiators = [
  { title: 'Built, Not Templated', description: 'Every system is custom-architected for your workflows — no generic chatbot wrappers.' },
  { title: 'Full-Stack Capability', description: 'From AI logic to production-grade web apps — one team, start to finish.' },
  { title: 'Transparent Process', description: 'Clear timelines, clear pricing, regular updates — no black box.' },
  { title: 'Long-Term Partnership', description: "We support and iterate on what we build — automation isn't a one-time deploy." },
]

export function WhyAxonvia() {
  return (
    <Section wash labelledBy="why-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2
            id="why-title"
            className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:text-[2.75rem]"
          >
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

        <ul className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {differentiators.map((item) => (
            <li key={item.title} className="border-t border-[var(--rule-strong)] pt-5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-[var(--text-secondary)]">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
