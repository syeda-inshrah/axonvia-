'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Check, UserRound } from 'lucide-react'
import { RUN } from '@/lib/agent-run'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { Logo } from '@/components/ui/Logo'

const FINAL = RUN.length - 1
const EASE = [0.22, 1, 0.36, 1] as const

/** The agent console: the WhatsApp conversation so far, and the actions the agent has taken. */
function Console({ active }: { active: number }) {
  const lines = RUN.slice(0, active + 1).flatMap((step, i) => step.chat.map((line, j) => ({ ...line, key: `${i}-${j}` })))

  return (
    <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[var(--shadow-raised)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-[var(--rule)] bg-[image:var(--accent-gradient-soft)] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Axonvia agent</p>
        </div>
        <span className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
          Example run
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr]">
        <div className="flex min-h-[19rem] flex-col justify-end gap-2.5 border-b border-[var(--rule)] p-5 sm:border-b-0 sm:border-r">
          <p className="mb-auto text-xs font-medium text-[var(--text-muted)]">WhatsApp</p>
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <m.p
                key={line.key}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[0.8125rem] leading-snug ${
                  line.from === 'customer'
                    ? 'self-start rounded-bl-md bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    : line.from === 'agent'
                      ? 'self-end rounded-br-md bg-[image:var(--accent-gradient)] text-white'
                      : 'self-center rounded-full border border-[var(--border-glow-alt)] bg-[var(--tint-violet)] px-3 py-1 text-center text-xs text-[var(--accent-purple)]'
                }`}
              >
                {line.text}
              </m.p>
            ))}
          </AnimatePresence>
        </div>

        <ol className="divide-y divide-[var(--rule)] p-2">
          {RUN.map((step, i) => {
            const done = i <= active
            return (
              <li
                key={step.time}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-500 ${i === active ? 'bg-[var(--tint)]' : ''}`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    done ? (step.handoff ? 'bg-[var(--accent-purple)] text-white' : 'bg-[var(--accent-cyan)] text-white') : 'border border-[var(--rule-strong)]'
                  }`}
                >
                  {done &&
                    (step.handoff ? (
                      <UserRound aria-label="Handed to a person" className="h-3 w-3" />
                    ) : (
                      <Check aria-label="Done" className="h-3 w-3" />
                    ))}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[0.6875rem] text-[var(--text-muted)]">{step.time}</span>
                  {/* Pending steps read quieter by colour, not opacity, so every line keeps readable contrast. */}
                  <span
                    className={`block text-[0.8125rem] font-medium leading-snug transition-colors duration-500 ${
                      done ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {step.action}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/**
 * Scroll-told story of one request. On large screens the console stays in view while the six steps scroll
 * past; GSAP ScrollTrigger tracks which step is in the middle of the screen and Motion animates the console to
 * match, as it tilts from an angle to face the reader. Elsewhere (phones, reduced motion, no script) the
 * console shows the finished run beside the full list of steps.
 */
export function AgentStory() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(FINAL)
  // True while the story follows the scroll (large screens with motion); otherwise every step is shown as told.
  const [tracking, setTracking] = useState(false)

  useGSAP(
    () => {
      if (typeof window.matchMedia !== 'function') return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        setActive(0)
        setTracking(true)
        gsap.utils.toArray<HTMLElement>('[data-story-step]').forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && setActive(i),
          })
        })
        gsap.fromTo(
          '[data-story-console]',
          { rotationY: -16, rotationX: 8, scale: 0.94 },
          {
            rotationY: -3,
            rotationX: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-story-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true },
          }
        )
        return () => {
          setActive(FINAL)
          setTracking(false)
        }
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="relative scroll-mt-20 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div data-reveal className="max-w-3xl">
          <p className="text-sm font-medium text-[var(--accent-purple)]">An agent at work</p>
          <h2 id="story-title" className="mt-3 text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
            One request, handled end to end
          </h2>
          <p className="mt-5 max-w-[36rem] text-lg text-[var(--text-secondary)]">
            An example of the agents we build: they read the request, check your systems, act, and bring in your team
            when a decision needs a person.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-8 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
            <div className="w-full [perspective:1600px]">
              <div data-story-console style={{ transformStyle: 'preserve-3d' }}>
                <Console active={active} />
              </div>
            </div>
          </div>

          <ol data-story-steps className="lg:py-[20vh]">
            {RUN.map((step, i) => (
              <li
                key={step.time}
                data-story-step
                aria-current={i === active ? 'step' : undefined}
                className="flex min-h-0 flex-col justify-center border-t border-[var(--rule)] py-8 first:border-t-0 lg:min-h-[62vh] lg:border-t-0 lg:py-0"
              >
                <span
                  aria-hidden="true"
                  className={`font-serif text-5xl leading-none transition-colors duration-500 lg:text-6xl ${
                    !tracking || i === active ? 'text-gradient' : 'text-[#7C87A6]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`mt-4 text-2xl font-semibold transition-colors duration-500 md:text-3xl ${
                    !tracking || i === active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[30rem] text-[var(--text-secondary)]">{step.story}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
