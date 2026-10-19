import { CalEmbed } from '@/components/CalEmbed'
import { ContactForm } from '@/components/ContactForm'

export function FinalCta() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 rounded-2xl bg-[var(--ink-panel)] px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-20">
        <div className="on-ink lg:col-span-6">
          <h2
            id="final-cta-title"
            className="max-w-[16ch] text-[2.25rem] leading-[1.05] font-semibold text-white md:text-[3.25rem]"
          >
            Ready to put AI to work in your business?
          </h2>
          <p className="mt-6 max-w-[30rem] text-lg text-[#C3CDE0]">
            Book a free strategy call — we&apos;ll show you exactly where automation can save you time and grow
            revenue.
          </p>
          <CalEmbed variant="inverse" size="large" className="mt-9">
            Book Your Free Call
          </CalEmbed>
          <p className="mt-4 text-sm text-[#AEBAD1]">No commitment. 20-minute call. Real answers.</p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8 lg:col-span-6">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Send us a message</h3>
          <p className="mt-2 mb-6 text-[0.9375rem] text-[var(--text-secondary)]">
            Prefer to write? Tell us what you&apos;d like to automate and we&apos;ll reply by email.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
