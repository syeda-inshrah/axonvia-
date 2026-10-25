import { Section } from '@/components/ui/SectionHeader'
import { BookingButton } from '@/components/ui/BookingButton'

// Replaces the testimonials section while Axonvia is early-stage (components/sections/Testimonials.tsx is kept,
// unused, for when real testimonials are published from the admin).
export function FoundingClients() {
  return (
    <Section labelledBy="founding-title">
      <div
        data-reveal
        className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-8 text-center shadow-[var(--shadow-raised)] backdrop-blur-xl md:p-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(45,91,255,0.16),transparent)]"
        />
        <h2
          id="founding-title"
          className="relative mx-auto max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
        >
          Become one of our founding clients
        </h2>
        <p className="relative mx-auto mt-5 max-w-[38rem] text-lg text-[var(--text-secondary)]">
          We&apos;re taking on a small number of founding clients who get priority attention, founding-client pricing,
          and a system built hands-on by our team.
        </p>
        <BookingButton size="large" className="relative mt-8" />
      </div>
    </Section>
  )
}
