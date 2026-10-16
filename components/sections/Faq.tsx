import { getPublishedFaqs } from '@/lib/queries/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { siteConfig } from '@/lib/site'

export async function Faq() {
  const faqs = await getPublishedFaqs()

  return (
    <section id="faq" className="px-5 md:px-10 py-24 section-alt">
      <SectionHeader eyebrow="FAQ" title="Common Questions" />
      <div className="mt-12 max-w-[760px] mx-auto">
        {faqs.length > 0 ? (
          <FaqAccordion items={faqs} />
        ) : (
          <p className="text-center text-[var(--text-secondary)]">
            Have a question about your project? Email{' '}
            <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline text-[var(--accent-cyan)]">
              {siteConfig.contactEmail}
            </a>{' '}
            or{' '}
            <a href="#final-cta" className="link-underline text-[var(--accent-cyan)]">
              book a call
            </a>
            .
          </p>
        )}
      </div>
    </section>
  )
}
