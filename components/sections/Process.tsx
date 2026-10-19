'use client'

import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

const steps = [
  { title: 'Discovery Call', when: 'Week 0', description: 'We understand your business, bottlenecks, and goals — no obligation, no jargon.' },
  { title: 'Proposal & Scope', when: 'Week 0–1', description: 'You receive a clear scope, timeline, and fixed-price or milestone-based quote.' },
  { title: 'Build Sprint', when: 'Weeks 1–3, varies by project', description: 'Our team builds in focused sprints, with regular check-ins and demos.' },
  { title: 'Testing & Handoff', when: 'Final week', description: 'Rigorous testing, documentation, and a walkthrough before go-live.' },
  { title: 'Support & Iteration', when: 'Ongoing', description: 'Post-launch monitoring, optimization, and support as your needs evolve.' },
]

/**
 * A step marker that lights up (white to the blue-violet gradient) as the drawn line reaches it. Its classes
 * are the lit state, so without scroll animation (reduced motion, server render) every step shows lit.
 */
function Marker({ index, progress, animated }: { index: number; progress: MotionValue<number>; animated: boolean }) {
  const at = (index / (steps.length - 1)) * 0.92
  const lit = useTransform(progress, [Math.max(0, at - 0.04), at], [0, 1])
  const color = useTransform(lit, [0, 1], ['#0A1530', '#FFFFFF'])

  return (
    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--bg-card)] text-sm font-semibold tabular-nums">
      <m.span
        data-step-lit
        aria-hidden="true"
        className="absolute inset-[-1px] rounded-full bg-[image:var(--accent-gradient)] shadow-[0_0_0_6px_rgba(46,91,255,0.12)]"
        style={animated ? { opacity: lit } : undefined}
      />
      <m.span className="relative text-white" style={animated ? { color } : undefined}>
        {index + 1}
      </m.span>
    </span>
  )
}

export function Process() {
  const track = useRef<HTMLDivElement>(null)
  const animated = !usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 75%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <Section id="how-it-works" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        title="From first call to live system"
        subtitle="A clear scope and quote before any build work, then short sprints with regular demos."
      />

      <div ref={track} className="relative mt-16 md:mt-20">
        {/* The line runs through the centre of the markers: down the left edge on mobile, across from lg.
            It draws itself with the scrollbar; reduced-motion visitors see it fully drawn. */}
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-5 bottom-5 w-px bg-[var(--rule)] lg:left-5 lg:right-5 lg:top-[19px] lg:bottom-auto lg:h-px lg:w-auto"
        >
          <m.div
            data-process-line
            data-scroll-linked={animated}
            className="h-full w-full origin-top bg-[image:var(--accent-gradient)] lg:hidden"
            style={animated ? { scaleY: progress } : undefined}
          />
          <m.div
            className="hidden h-full w-full origin-left bg-[image:var(--accent-gradient)] lg:block"
            style={animated ? { scaleX: progress } : undefined}
          />
        </div>

        <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
              <Marker index={i} progress={progress} animated={animated} />
              <div className="lg:mt-7 lg:pr-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{step.when}</p>
                <p className="mt-3 text-[0.9375rem] text-[var(--text-secondary)]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
