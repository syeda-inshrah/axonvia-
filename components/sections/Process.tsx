'use client'

import { useRef } from 'react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

const steps = [
  { title: 'Discovery Call', when: 'Week 0', description: 'We understand your business, bottlenecks, and goals — no obligation, no jargon.' },
  { title: 'Proposal & Scope', when: 'Week 0–1', description: 'You receive a clear scope, timeline, and fixed-price or milestone-based quote.' },
  { title: 'Build Sprint', when: 'Weeks 1–3, varies by project', description: 'Our team builds in focused sprints, with regular check-ins and demos.' },
  { title: 'Testing & Handoff', when: 'Final week', description: 'Rigorous testing, documentation, and a walkthrough before go-live.' },
  { title: 'Support & Iteration', when: 'Ongoing', description: 'Post-launch monitoring, optimization, and support as your needs evolve.' },
]

const markerBase =
  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums'

export function Process() {
  const track = useRef<HTMLDivElement>(null)

  // Scrubbed to the scrollbar: the rule draws across the steps and each number fills in as the line reaches
  // it. Without motion (reduced motion, no script) the line is drawn and every step is filled.
  useGSAP(
    () =>
      withMotion(() => {
        const markers = gsap.utils.toArray<HTMLElement>('[data-step-marker]')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: track.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
        })
        tl.fromTo('[data-process-line]', { scale: 0 }, { scale: 1, duration: 1 }, 0)
        markers.forEach((marker, i) => {
          tl.fromTo(
            marker,
            { backgroundColor: '#FFFFFF', color: '#0B1B3F', borderColor: '#C9D2E0' },
            { backgroundColor: '#0B1B3F', color: '#FFFFFF', borderColor: '#0B1B3F', duration: 0.08 },
            (i / (markers.length - 1)) * 0.92
          )
        })
      }),
    { scope: track }
  )

  return (
    <Section id="how-it-works" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        title="From first call to live system"
        subtitle="A clear scope and quote before any build work, then short sprints with regular demos."
      />

      <div ref={track} className="relative mt-16 md:mt-20">
        {/* The rule runs through the centre of the markers: down the left edge on mobile, across from lg. */}
        <div aria-hidden="true" className="absolute left-[17px] top-4 bottom-4 w-px bg-[var(--rule)] lg:left-4 lg:right-4 lg:top-[17px] lg:bottom-auto lg:h-px lg:w-auto">
          <div data-process-line className="h-full w-full origin-top-left bg-[var(--ink-panel)]" />
        </div>

        <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
              <span
                data-step-marker
                className={`${markerBase} border-[var(--ink-panel)] bg-[var(--ink-panel)] text-[var(--on-accent)]`}
              >
                {i + 1}
              </span>
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
