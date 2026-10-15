'use client'

import { motion } from 'framer-motion'
import { GradientBlob } from '@/components/ui/GradientBlob'
import { CalEmbed } from '@/components/CalEmbed'
import { fadeUp } from '@/lib/animations'

export function FinalCta() {
  return (
    <section id="final-cta" className="relative px-5 md:px-10 py-32 overflow-hidden">
      <GradientBlob color="cyan" className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
          Ready to Put AI to Work in Your Business?
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] text-lg">
          Book a free strategy call — we&apos;ll show you exactly where automation can save you time and grow
          revenue.
        </p>
        <CalEmbed size="large" className="mt-8">
          Book Your Free Call
        </CalEmbed>
        <p className="mt-4 text-xs text-[var(--text-muted)]">No commitment. 20-minute call. Real answers.</p>
      </motion.div>
    </section>
  )
}
