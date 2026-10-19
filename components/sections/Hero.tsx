'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CalEmbed } from '@/components/CalEmbed'
import { AgentRunLog } from '@/components/sections/AgentRunLog'
import { EASE, gsap, SplitText, useGSAP, withMotion } from '@/lib/gsap'

const HEADLINE = 'AI Automation & Intelligent Solutions for Modern Businesses'

/** Plays the run log one step at a time: each row arrives, its marker pulses, then settles to its result. */
function playRun(scope: HTMLElement) {
  const rows = gsap.utils.toArray<HTMLElement>('[data-log-row]', scope)
  // Its own paused timeline rather than a child of the intro, so Replay can restart it after the intro ends.
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } })
  tl.set('[data-log-progress]', { scaleX: 0 })

  rows.forEach((row, i) => {
    const pending = row.querySelector('[data-log-pending]')
    const done = row.querySelector('[data-log-done]')
    const at = i === 0 ? '>' : '>+=0.15'
    tl.fromTo(row, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, at)
      .fromTo(done, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35 }, '>+=0.45')
      .fromTo(pending, { opacity: 1, scale: 1 }, { opacity: 0, scale: 2.4, duration: 0.45, ease: 'power2.out' }, '<-0.45')
      .to('[data-log-progress]', { scaleX: (i + 1) / rows.length, duration: 0.5, ease: 'power2.inOut' }, '<')
    if (row.hasAttribute('data-handoff')) {
      tl.fromTo(row, { backgroundColor: 'rgba(29,78,216,0)' }, { backgroundColor: 'rgba(29,78,216,0.06)', duration: 0.6 }, '<')
    }
  })
  return tl
}

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const run = useRef<gsap.core.Timeline | null>(null)
  const [played, setPlayed] = useState(false)

  // One orchestrated entrance: the headline rises line by line, the supporting copy follows, then the agent
  // run plays through once. Reduced-motion visitors (and the server render) get the finished state.
  useGSAP(
    () =>
      withMotion(() => {
        const root = scope.current!
        gsap.set('[data-intro]', { visibility: 'visible' })

        const split = SplitText.create('[data-hero-title]', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.09, ease: EASE }),
        })

        const intro = gsap.timeline({ delay: 0.45, defaults: { ease: EASE } })
        intro
          .from('[data-hero-fade]', { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 })
          .from('[data-log-panel]', { opacity: 0, y: 24, duration: 1 }, '-=0.6')
        run.current = playRun(root).eventCallback('onComplete', () => setPlayed(true))
        intro.call(() => void run.current?.play(), [], '-=0.4')

        return () => {
          split.revert()
          run.current = null
          setPlayed(false)
        }
      }),
    { scope }
  )

  // Restarts the existing timeline (no new tweens), so it needs no GSAP context.
  function replay() {
    setPlayed(false)
    run.current?.restart()
  }

  return (
    <section ref={scope} className="relative px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-44">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-7">
          <h1
            data-intro
            data-hero-title
            className="text-[clamp(2.5rem,4.4vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-[var(--text-primary)]"
          >
            {HEADLINE}
          </h1>

          <p data-intro data-hero-fade className="mt-7 max-w-[36rem] text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Axonvia designs and builds AI automation, agentic AI systems, custom AI-powered applications, and business
            workflow automation — shaped around how your business actually works.
          </p>

          <div
            data-intro
            data-hero-fade
            className="mt-10 flex flex-col items-center gap-3 min-[480px]:flex-row min-[480px]:flex-wrap"
          >
            <CalEmbed size="large" className="w-full min-[480px]:w-auto">
              Book a Free Strategy Call
            </CalEmbed>
            <Button href="#projects" variant="secondary" size="large" className="w-full min-[480px]:w-auto">
              See Our Work
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AgentRunLog canReplay={played} onReplay={replay} />
        </div>
      </div>
    </section>
  )
}
