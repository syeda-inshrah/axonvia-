import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { TiltCard } from '@/components/ui/TiltCard'
import { BookingButton } from '@/components/ui/BookingButton'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { ExampleConversation } from '@/components/landing/ExampleConversation'
import { Breadcrumbs, PageShell } from '@/components/landing/PageShell'
import { landingJsonLd } from '@/components/landing/landing-json-ld'
import { landingPages, type LandingPageContent } from '@/lib/landing-pages'

const headingClasses =
  'text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--text-primary)]'

/** One solution landing page (AI voice agents, AI chatbots, real estate), built from the homepage's sections. */
export function LandingPage({ page }: { page: LandingPageContent }) {
  const related = landingPages.filter((other) => other.path !== page.path)
  const faqs = page.faqs.map(([question, answer], i) => ({ id: `${page.path}-${i}`, question, answer, isPublished: true, sortOrder: i }))

  return (
    <PageShell jsonLd={landingJsonLd(page)}>
      <section className="relative isolate overflow-hidden px-5 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Breadcrumbs
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: page.name, path: page.path },
              ]}
            />
            <p className="mt-6 text-sm font-medium text-[var(--accent-purple)]">{page.eyebrow}</p>
            <h1 className="mt-3 max-w-[20ch] text-[clamp(2.3rem,4.6vw,4rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-[var(--text-secondary)]">{page.intro}</p>
            <div className="mt-9 flex flex-col items-center gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
              <BookingButton size="large" className="w-full min-[480px]:w-auto" />
              <a href="#features" className={buttonClasses('secondary', 'large', 'w-full min-[480px]:w-auto')}>
                See what it can do
              </a>
            </div>
            <p className="mt-5 text-sm text-[var(--text-muted)]">Free 20-minute call · No commitment · We work in your time zone</p>
          </div>
          <div data-reveal className="lg:col-span-5">
            <ExampleConversation example={page.example} />
          </div>
        </div>
      </section>

      <Section id="features" labelledBy="features-title">
        <SectionHeader id="features-title" title={page.features.title} subtitle={page.features.subtitle} />
        <ul className="mt-14 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {page.features.items.map((feature) => (
            <li key={feature.title} data-reveal>
              <TiltCard className="h-full p-7">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">{feature.description}</p>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-we-build" wash labelledBy="steps-title">
        <SectionHeader id="steps-title" title={page.steps.title} subtitle={page.steps.subtitle} />
        <ol className="mt-14 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {page.steps.items.map((step, i) => (
            <li key={step.title} data-reveal className="rounded-3xl border border-white/80 bg-white/70 p-7 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <span className="font-serif text-5xl leading-none text-gradient">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="use-cases-title">
        <SectionHeader id="use-cases-title" title={page.useCases.title} subtitle={page.useCases.subtitle} />
        <ul className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
          {page.useCases.items.map((useCase) => (
            <li
              key={useCase.title}
              data-reveal
              className="rounded-2xl border border-[var(--rule)] bg-[var(--glass)] px-6 py-5 shadow-[var(--shadow-card)] backdrop-blur-md"
            >
              <h3 className="font-semibold text-[var(--text-primary)]">{useCase.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-[var(--text-secondary)]">{useCase.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" wash labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-4">
            <h2 id="faq-title" className={headingClasses}>
              Common questions
            </h2>
          </div>
          <div data-reveal className="lg:col-span-7 lg:col-start-6">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </Section>

      <Section labelledBy="related-title">
        <h2 id="related-title" data-reveal className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:text-3xl">
          Related services
        </h2>
        <ul data-reveal className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...related.map((other) => ({ href: other.path, label: other.name })), { href: '/services', label: 'All AI automation services' }].map(
            (link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between rounded-2xl border border-[var(--rule)] bg-[var(--glass)] px-6 py-5 font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-md transition-colors hover:border-[var(--border-glow)]"
                >
                  {link.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--accent-cyan)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            )
          )}
        </ul>
      </Section>
    </PageShell>
  )
}
