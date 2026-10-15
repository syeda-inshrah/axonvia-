import { getPublishedFaqs } from '@/lib/queries/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FaqAccordion } from '@/components/sections/FaqAccordion'

export async function Faq() {
  const faqs = await getPublishedFaqs()

  return (
    <section id="faq" className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader eyebrow="FAQ" title="Common Questions" />
      <div className="mt-12 max-w-[760px] mx-auto">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  )
}
