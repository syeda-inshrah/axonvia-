import { getPublishedFaqs } from '@/lib/queries/content'
import { Section } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { BOOKING_URL, siteConfig } from '@/lib/site'
import { withCoreFaqs } from '@/lib/faq-content'

function AskUs() {
  return (
    <>
      Email{' '}
      <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline text-[var(--accent-cyan)]">
        {siteConfig.contactEmail}
      </a>{' '}
      or{' '}
      <a href={BOOKING_URL} className="link-underline text-[var(--accent-cyan)]">
        book a free automation audit
      </a>
      .
    </>
  )
}

export async function Faq() {
  // The core FAQ is always present; admin-published FAQs follow it.
  const faqs = withCoreFaqs(await getPublishedFaqs())

  return (
    <Section id="faq" wash labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div data-reveal className="lg:col-span-4">
          <h2
            id="faq-title"
            className="text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
          >
            Common questions
          </h2>
          <p className="mt-5 max-w-[22rem] text-[var(--text-secondary)]">
            Something else on your mind? <AskUs />
          </p>
        </div>
        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </Section>
  )
}
