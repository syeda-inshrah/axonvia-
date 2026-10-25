'use client'

import { Fragment, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { BookingButton } from '@/components/ui/BookingButton'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { NeuralCore } from '@/components/motion/NeuralCore'
import { OPEN_CHAT_EVENT } from '@/components/chat/ChatWidget'
import { EASE, gsap, useGSAP, withMotion } from '@/lib/gsap'

const HEADLINE = 'AI automation that runs your operations, so your team can focus on growth.'

export function Hero() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.set('[data-intro]', { visibility: 'visible' })

        // The cinematic entrance: while the neural core assembles itself (NeuralCore), each headline word rises
        // out of its own mask, then the assistant chip, copy, buttons and scroll cue settle in.
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-hero-core]', { autoAlpha: 0, scale: 0.85, duration: 2.2 }, 0)
          .from('[data-word]', { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.055 }, 0.25)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 18, duration: 1, stagger: 0.1 }, 0.75)

        // Leaving the hero: the copy lifts away while the core grows and sinks, handing over to the story.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('[data-hero-content]', { y: -90, autoAlpha: 0 }, 0)
          .to('[data-hero-core]', { scale: 1.3, y: 120, autoAlpha: 0.25 }, 0)
        // Tablets and up only: on phones the headline shows at once, so the largest paint isn't held back by
        // script and animation on a slower CPU.
      }, '(min-width: 768px)'),
    { scope: section }
  )

  return (
    <section ref={section} className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-28 md:px-10">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
      <div className="absolute -right-[35%] top-16 -z-10 aspect-square w-[110vw] opacity-60 sm:-right-[20%] sm:w-[80vw] lg:-right-[6%] lg:top-1/2 lg:w-[min(58vw,860px)] lg:-translate-y-1/2 lg:opacity-100">
        {/* Positioning lives on the wrapper; GSAP animates this inner layer's transform freely. */}
        <div data-intro data-hero-core className="h-full w-full">
          <NeuralCore />
        </div>
      </div>

      <div data-hero-content className="relative mx-auto w-full max-w-[1200px]">
        <div data-intro data-hero-fade>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--glass)] py-1.5 pl-1.5 pr-4 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-card)] backdrop-blur-md transition-colors hover:border-[var(--border-glow)] hover:text-[var(--text-primary)]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[image:var(--accent-gradient)] text-white">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            Ask our AI assistant
          </button>
        </div>

        <h1
          data-intro
          className="mt-7 max-w-[19ch] text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--text-primary)]"
        >
          {HEADLINE.split(' ').map((text, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className="inline-block overflow-hidden pb-[0.1em] align-top">
                <span data-word className="inline-block origin-bottom-left">
                  {text}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>

        <p
          data-intro
          data-hero-fade
          className="mt-8 max-w-[34rem] text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
        >
          Axonvia automates repetitive work, manages your leads intelligently, and builds AI-powered systems around how
          your business actually works.
        </p>

        <div
          data-intro
          data-hero-fade
          className="mt-10 flex flex-col items-center gap-3 min-[480px]:flex-row min-[480px]:flex-wrap"
        >
          <MagneticButton className="w-full min-[480px]:w-auto">
            <BookingButton size="large" className="w-full min-[480px]:w-auto" />
          </MagneticButton>
          <a href="#story" className={buttonClasses('secondary', 'large', 'w-full min-[480px]:w-auto')}>
            See how it works
          </a>
        </div>

        <p data-intro data-hero-fade className="mt-5 text-sm text-[var(--text-muted)]">
          Free 20-minute call · No commitment · We work in your time zone
        </p>
      </div>
    </section>
  )
}
