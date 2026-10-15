'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { fadeUp, staggerContainer } from '@/lib/animations'

const steps = [
  { title: 'Discovery Call', when: 'Week 0', description: 'We understand your business, bottlenecks, and goals — no obligation, no jargon.' },
  { title: 'Proposal & Scope', when: 'Week 0–1', description: 'You receive a clear scope, timeline, and fixed-price or milestone-based quote.' },
  { title: 'Build Sprint', when: 'Week 1–3, varies by project', description: 'Our team builds in focused sprints, with regular check-ins and demos.' },
  { title: 'Testing & Handoff', when: 'Final week', description: 'Rigorous testing, documentation, and a walkthrough before go-live.' },
  { title: 'Support & Iteration', when: 'Ongoing', description: 'Post-launch monitoring, optimization, and support as your needs evolve.' },
]

export function Process() {
  return (
    <section className="px-5 md:px-10 py-24 bg-[var(--bg-secondary)]">
      <SectionHeader eyebrow="Our Process" title="From First Call to Live System" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.12)}
        className="mt-12 max-w-2xl mx-auto border-l border-[var(--border-glass)] pl-8"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-glass)] bg-[var(--bg-primary)] text-sm font-semibold text-[var(--text-primary)]">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
            <span className="text-xs text-[var(--text-muted)]">{step.when}</span>
            <p className="mt-2 text-[var(--text-secondary)]">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
