import { getPublishedTestimonials } from '@/lib/queries/content'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { CalEmbed } from '@/components/CalEmbed'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials()

  return (
    <Section labelledBy="testimonials-title">
      <SectionHeader id="testimonials-title" title="Trusted to deliver" />

      <div className="mt-14 md:mt-16">
        {testimonials.length === 0 ? (
          <div data-reveal className="max-w-xl rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Early-stage and building in public</h3>
            <p className="mt-3 text-[var(--text-secondary)]">
              We&apos;re a new agency focused on shipping real systems before collecting testimonials. Be one of the
              first businesses we partner with.
            </p>
            <CalEmbed variant="secondary" className="mt-6">
              Be one of our first case studies
            </CalEmbed>
          </div>
        ) : (
          <TestimonialCarousel items={testimonials} />
        )}
      </div>
    </Section>
  )
}
