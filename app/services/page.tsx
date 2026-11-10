import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { TiltCard } from '@/components/ui/TiltCard'
import { BookingButton } from '@/components/ui/BookingButton'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { Process } from '@/components/sections/Process'
import { Breadcrumbs, PageShell } from '@/components/landing/PageShell'
import { ORG_ID, breadcrumb } from '@/components/landing/landing-json-ld'
import { landingPages } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/page-metadata'
import { SITE_URL, services } from '@/lib/site'

const description =
  'AI automation services for US and international businesses: workflow automation, lead management, AI chatbots, AI voice agents and custom AI software.'

export const metadata = pageMetadata({ title: 'AI Automation Services for Businesses', description, path: '/services' })

const FAQS: [string, string][] = [
  [
    'Which AI automation service is right for my business?',
    'Most businesses start with the work that costs the most time or loses the most leads. The free 20-minute audit is where we find it together and recommend what to automate first.',
  ],
  [
    'Do you work with businesses in the US?',
    'Yes. We work with clients in the US, UK, UAE and worldwide, and schedule calls in your time zone.',
  ],
  [
    'Can you combine several services?',
    'Yes, and they work best together: a chatbot, a voice agent and your lead follow-up can share the same knowledge, calendar and CRM.',
  ],
  [
    'How does a project start?',
    'With a free automation audit. You then receive a clear scope, timeline and fixed-price or milestone-based quote before any work begins.',
  ],
]

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/services#page`,
      name: 'AI Automation Services',
      description,
      url: `${SITE_URL}/services`,
      about: { '@id': ORG_ID },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          ...landingPages.map((page) => ({ name: page.name, url: `${SITE_URL}${page.path}` })),
          ...services.map((service) => ({ name: service.title, url: `${SITE_URL}/services#${service.slug}` })),
        ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/services#faq`,
      mainEntity: FAQS.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    },
    breadcrumb(TRAIL),
  ],
}

export default function ServicesPage() {
  return (
    <PageShell jsonLd={jsonLd}>
      <section className="relative isolate overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1200px]">
          <Breadcrumbs trail={TRAIL} />
          <p className="mt-6 text-sm font-medium text-[var(--accent-purple)]">AI automation agency</p>
          <h1 className="mt-3 max-w-[20ch] text-[clamp(2.3rem,4.6vw,4rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            AI automation services, built around how your business works
          </h1>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-[var(--text-secondary)]">
            From a single automated workflow to AI chatbots, voice agents and complete AI systems. Axonvia designs and
            builds custom automation for growing businesses in the US and worldwide, connected to the tools you
            already use.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
            <BookingButton size="large" className="w-full min-[480px]:w-auto" />
            <a href="#all-services" className={buttonClasses('secondary', 'large', 'w-full min-[480px]:w-auto')}>
              Browse all services
            </a>
          </div>
        </div>
      </section>

      <Section labelledBy="solutions-title" className="!pt-4 md:!pt-6">
        <h2 id="solutions-title" data-reveal className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:text-3xl">
          Popular solutions
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {landingPages.map((page) => (
            <li key={page.path} data-reveal>
              <TiltCard className="h-full p-7">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{page.name}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">{page.description.split('. ')[0]}.</p>
                <Link
                  href={page.path}
                  className="link-underline group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-cyan)]"
                >
                  Explore {page.name}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="all-services" wash labelledBy="all-services-title">
        <SectionHeader
          id="all-services-title"
          title="Everything we build"
          subtitle="Five core services that can stand alone or work together as one system."
        />
        <div className="mt-14 divide-y divide-[var(--rule)] md:mt-16">
          {services.map((service) => {
            const deeper = service.links.filter((link) => !link.href.startsWith('/services'))
            return (
              <article key={service.slug} id={service.slug} data-reveal className="grid scroll-mt-24 grid-cols-1 gap-6 py-10 first:pt-0 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{service.title}</h3>
                  <p className="mt-3 text-[var(--text-secondary)]">{service.description}</p>
                  {deeper.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {deeper.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="link-underline group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-cyan)]"
                        >
                          {link.label}
                          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <ul className="space-y-2.5 md:col-span-6 md:col-start-7">
                  {service.examples.map((example) => (
                    <li key={example} className="flex items-start gap-2.5 text-[var(--text-primary)]">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-cyan)]" />
                      {example}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </Section>

      <Process />

      <Section id="faq" wash labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-4">
            <h2
              id="faq-title"
              className="text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
            >
              Common questions
            </h2>
          </div>
          <div data-reveal className="lg:col-span-7 lg:col-start-6">
            <FaqAccordion
              items={FAQS.map(([question, answer], i) => ({ id: `services-${i}`, question, answer, isPublished: true, sortOrder: i }))}
            />
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
