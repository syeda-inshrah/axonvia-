'use client'

import { Fragment, useRef, type PointerEvent } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { CalEmbed } from '@/components/CalEmbed'
import { Aurora } from '@/components/motion/Aurora'
import { AgentRunLog } from '@/components/sections/AgentRunLog'
import { EASE, stagger } from '@/lib/motion'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

const HEADLINE = 'AI Automation & Intelligent Solutions for Modern Businesses'

// Each word rises out of its own mask, one after another: the page's single cinematic entrance.
const word = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 1, ease: EASE } },
}
const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  // As the hero scrolls away, its content drifts down and fades, so the next section slides over it.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

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

      <m.div
        data-scroll-fade={!reduced}
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-12"
      >
        <m.div initial="hidden" animate="visible" variants={stagger(0.12, 0.2)} className="lg:col-span-7">
          <m.h1
            variants={stagger(0.06)}
            className="text-[clamp(2.5rem,4.6vw,3.9rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-white"
          >
            {HEADLINE.split(' ').map((text, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <m.span data-word variants={word} className="inline-block">
                    {text}
                  </m.span>
                </span>
              </Fragment>
            ))}
          </m.h1>

          <m.p variants={fade} className="mt-7 max-w-[36rem] text-lg leading-relaxed text-[var(--on-ink-soft)] md:text-xl">
            Axonvia designs and builds AI automation, agentic AI systems, custom AI-powered applications, and business
            workflow automation — shaped around how your business actually works.
          </m.p>

          <m.div variants={fade} className="mt-10 flex flex-col items-center gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
            <CalEmbed size="large" className="w-full min-[480px]:w-auto">
              Book a Free Strategy Call
            </CalEmbed>
            <Button href="#projects" variant="outline-ink" size="large" className="w-full min-[480px]:w-auto">
              See Our Work
            </Button>
          </m.div>
        </m.div>

        <m.div
          className="lg:col-span-5 [perspective:1400px]"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
        >
          <m.div
            initial={{ rotateX: 14, scale: 0.96 }}
            animate={{ rotateX: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <AgentRunLog startAt={1.8} />
          </m.div>
        </m.div>
      </m.div>
    </section>
  )
}
