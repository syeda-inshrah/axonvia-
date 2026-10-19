import { getPublishedFaqs } from '@/lib/queries/content'
import { Section } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { siteConfig } from '@/lib/site'
import { Reveal } from '@/components/motion/Reveal'

function AskUs() {
  return (
    <>
      Email{' '}
      <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline text-[var(--accent-cyan)]">
        {siteConfig.contactEmail}
      </a>{' '}
      or{' '}
      <a href="#final-cta" className="link-underline text-[var(--accent-cyan)]">
        book a call
      </a>
      .
    </>
  )
}

export async function Faq() {
  const faqs = await getPublishedFaqs()

  return (
    <Section id="faq" wash labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 id="faq-title" className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:text-[2.75rem]">
            Common questions
          </h2>
          {faqs.length > 0 && (
            <p className="mt-5 max-w-[22rem] text-[var(--text-secondary)]">
              Something else on your mind? <AskUs />
            </p>
          )}
        </Reveal>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          {faqs.length > 0 ? (
            <FaqAccordion items={faqs} />
          ) : (
            <p className="text-lg text-[var(--text-secondary)]">
              Have a question about your project? <AskUs />
            </p>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
