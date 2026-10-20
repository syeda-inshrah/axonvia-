import { CalEmbed } from '@/components/CalEmbed'
import { ContactForm } from '@/components/ContactForm'
import { Aurora } from '@/components/motion/Aurora'

export function FinalCta() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="scroll-mt-16 px-5 py-16 md:px-10 md:py-24">
      <div
        data-reveal
        className="relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1C36C8_0%,#3B2BC9_50%,#5527D6_100%)] shadow-[0_60px_120px_-50px_rgba(45,60,200,0.7)]"
      >
        <Aurora className="opacity-60 mix-blend-screen" />
        <div aria-hidden="true" className="dot-grid absolute inset-0" />

        <div className="relative grid grid-cols-1 gap-12 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-20">
          <div className="on-ink lg:col-span-6">
            <h2
              id="final-cta-title"
              className="max-w-[14ch] text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.035em] text-white md:text-[3.75rem]"
            >
              Ready to put AI to work in your business?
            </h2>
            <p className="mt-6 max-w-[30rem] text-lg text-white/90">
              Book a free strategy call — we&apos;ll show you exactly where automation can save you time and grow
              revenue.
            </p>
            <CalEmbed variant="inverse" size="large" className="mt-9">
              Book Your Free Call
            </CalEmbed>
            <p className="mt-4 text-sm text-white/85">No commitment. 20-minute call. Real answers.</p>
          </div>

          <div className="rounded-3xl bg-white/95 p-6 shadow-[0_40px_80px_-40px_rgba(10,10,60,0.6)] backdrop-blur-xl sm:p-8 lg:col-span-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Send us a message</h3>
            <p className="mt-2 mb-6 text-[0.9375rem] text-[var(--text-secondary)]">
              Prefer to write? Tell us what you&apos;d like to automate and we&apos;ll reply by email.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
