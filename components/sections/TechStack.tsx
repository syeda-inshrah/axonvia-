'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { scatterIn, staggerContainer } from '@/lib/animations'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

const chips = [
  'Claude API',
  'Agentic AI',
  'OpenAI',
  'FastAPI',
  'Next.js',
  'React',
  'Python',
  'Node.js',
  'PostgreSQL',
  'Neon',
  'LangChain',
  'Vector Databases',
  'REST & Webhooks',
  'WhatsApp API',
]

export function TechStack() {
  // The float loops forever, so it's skipped entirely for reduced-motion visitors.
  const floating = !usePrefersReducedMotion()

  return (
    <section className="px-5 md:px-10 py-24">
      <SectionHeader eyebrow="Our Stack" title="Built on Proven, Modern Technology" />

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.05)}
        className="mt-12 flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto"
      >
        {chips.map((chip, i) => {
          // Spread phases and periods so neighbouring chips never bob in sync.
          const delay = Number(((i * 0.37) % 2).toFixed(2))
          return (
            <motion.li key={chip} variants={scatterIn}>
              <motion.div
                key={String(floating)}
                data-floating={floating}
                data-float-delay={delay}
                animate={floating ? { y: [0, -4, 0] } : undefined}
                transition={{ duration: 3 + (i % 4) * 0.5, delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Chip label={chip} />
              </motion.div>
            </motion.li>
          )
        })}
      </motion.ul>
    </section>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <Badge className="normal-case text-sm text-[var(--text-secondary)] px-4 py-2 bg-[rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-200 hover:border-[var(--border-glow)] hover:text-[var(--text-primary)] hover:shadow-[0_0_16px_rgba(45,212,255,0.25)]">
      {label}
    </Badge>
  )
}
