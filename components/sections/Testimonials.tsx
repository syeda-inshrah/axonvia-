import { getPublishedTestimonials } from '@/lib/queries/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CalEmbed } from '@/components/CalEmbed'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials()

  return (
    <section className="px-5 md:px-10 py-24">
      <SectionHeader eyebrow="What People Say" title="Trusted to Deliver" />

      <div className="mt-12 max-w-[1320px] mx-auto">
        {testimonials.length === 0 ? (
          <GlassCard className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Early-stage and building in public</h3>
            <p className="mt-3 text-[var(--text-secondary)]">
              We&apos;re a new agency focused on shipping real systems before collecting testimonials. Be one of the
              first businesses we partner with.
            </p>
            <CalEmbed className="mt-5">Be one of our first case studies</CalEmbed>
          </GlassCard>
        ) : (
          <TestimonialCarousel items={testimonials} />
        )}
      </div>
    </section>
  )
}
