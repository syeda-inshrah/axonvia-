'use client'

import { useRef } from 'react'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

const steps = [
  { title: 'Free Discovery Call', when: 'Week 0', description: 'A 20-minute call about your business, your bottlenecks and your goals. No obligation.' },
  { title: 'Proposal & Scope', when: 'Week 0–1', description: 'A clear scope, timeline and fixed-price or milestone-based quote.' },
  { title: 'Build Sprint', when: 'Weeks 1–3, varies by project', description: 'Focused sprints with regular check-ins and demos.' },
  { title: 'Testing & Handoff', when: 'Final week', description: 'Thorough testing, documentation and a walkthrough before go-live.' },
  { title: 'Support & Iteration', when: 'Ongoing', description: 'Monitoring, fixes and improvements as your needs grow.' },
]

export function Process() {
  const track = useRef<HTMLDivElement>(null)

  // Scrubbed to the scrollbar: the gradient line draws through the steps and each marker lights up as the
  // line reaches it. The markup is the finished state, so reduced motion (and no script) shows it drawn.
  useGSAP(
    () =>
      withMotion(() => {
        const lit = gsap.utils.toArray<HTMLElement>('[data-step-lit]')
        const numbers = gsap.utils.toArray<HTMLElement>('[data-step-number]')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: track.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
        })
        tl.fromTo('[data-process-line]', { scale: 0 }, { scale: 1, duration: 1 }, 0)
        lit.forEach((marker, i) => {
          const at = (i / (lit.length - 1)) * 0.92
          tl.fromTo(marker, { opacity: 0 }, { opacity: 1, duration: 0.06 }, at)
          tl.fromTo(numbers[i], { color: '#0A1530' }, { color: '#FFFFFF', duration: 0.06 }, at)
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
        {/* The line runs through the centre of the markers: down the left edge on mobile, across from lg. */}
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-5 bottom-5 w-px bg-[var(--rule)] lg:left-5 lg:right-5 lg:top-[19px] lg:bottom-auto lg:h-px lg:w-auto"
        >
          <div data-process-line className="h-full w-full origin-top-left bg-[image:var(--accent-gradient)]" />
        </div>

        <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--bg-card)] text-sm font-semibold tabular-nums">
                <span
                  data-step-lit
                  aria-hidden="true"
                  className="absolute inset-[-1px] rounded-full bg-[image:var(--accent-gradient)] shadow-[0_0_0_6px_rgba(46,91,255,0.12)]"
                />
                <span data-step-number className="relative text-white">
                  {i + 1}
                </span>
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
