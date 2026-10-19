'use client'

import { Fragment, useRef, type PointerEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { CalEmbed } from '@/components/CalEmbed'
import { Aurora } from '@/components/motion/Aurora'
import { AgentRunLog } from '@/components/sections/AgentRunLog'
import { EASE, gsap, useGSAP, withMotion } from '@/lib/gsap'

const HEADLINE = 'AI Automation & Intelligent Solutions for Modern Businesses'

export function Hero() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.set('[data-intro]', { visibility: 'visible' })

        // One orchestrated entrance: each headline word rises out of its own mask, the copy and buttons follow,
        // then the agent run panel tilts upright into place (and starts its own run, see AgentRunLog).
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-word]', { yPercent: 110, duration: 1.1, stagger: 0.06 }, 0.15)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.55)
          .from('[data-hero-panel]', { autoAlpha: 0, y: 48, rotationX: 14, scale: 0.96, transformOrigin: '50% 100%', duration: 1.3 }, 0.7)

        // As the hero scrolls away, its content drifts down and fades, so the next section slides over it.
        gsap.to('[data-hero-content]', {
          y: 140,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }),
    { scope: section }
  )

  // A soft light follows the pointer across the navy, set through CSS variables so nothing re-renders.
  function trackLight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--light-x', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--light-y', `${event.clientY - box.top}px`)
  }

  return (
    <section
      ref={section}
      onPointerMove={trackLight}
      className="on-ink relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--ink-panel)] px-5 pb-20 pt-28 md:px-10 md:pt-32"
    >
      <Aurora />
      <div aria-hidden="true" className="dot-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--light-x,70%)_var(--light-y,30%),rgba(142,166,255,0.12),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(46,91,255,0.7),rgba(106,75,239,0.7),transparent)]"
      />

      <div
        data-hero-content
        className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-12"
      >
        <div className="lg:col-span-7">
          <h1
            data-intro
            className="text-[clamp(2.5rem,4.6vw,3.9rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-white"
          >
            {HEADLINE.split(' ').map((text, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <span data-word className="inline-block">
                    {text}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>

          <p
            data-intro
            data-hero-fade
            className="mt-7 max-w-[36rem] text-lg leading-relaxed text-[var(--on-ink-soft)] md:text-xl"
          >
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
            <Button href="#projects" variant="outline-ink" size="large" className="w-full min-[480px]:w-auto">
              See Our Work
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 [perspective:1400px]">
          <div data-intro data-hero-panel>
            <AgentRunLog startAt={1.8} />
          </div>
        </div>
      </div>
    </section>
  )
}
