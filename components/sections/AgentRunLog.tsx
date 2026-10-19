'use client'

import { useRef, useState } from 'react'
import { Check, RotateCcw, UserRound } from 'lucide-react'
import { EASE, gsap, useGSAP, withMotion } from '@/lib/gsap'

// An illustrative run of the kind of agent Axonvia builds: it reads a request, checks the business's systems,
// acts, and hands off when a decision needs a person.
export const RUN = [
  { time: '09:14:02', action: 'Message received on WhatsApp', detail: '“Can I move Thursday’s appointment to Friday afternoon?”' },
  { time: '09:14:03', action: 'Found the customer in the CRM', detail: 'Ayesha Khan, three previous bookings' },
  { time: '09:14:04', action: 'Checked the calendar', detail: 'Friday 2:30 pm and 4:00 pm are free' },
  { time: '09:14:06', action: 'Replied with both times', detail: 'In the same WhatsApp conversation' },
  { time: '09:15:40', action: 'Rebooked for Friday, 4:00 pm', detail: 'Calendar updated and confirmation sent' },
  {
    time: '09:15:41',
    action: 'Handed to Sara at the front desk',
    detail: 'A deposit refund needs a person’s approval',
    handoff: true,
  },
]

/** Each step arrives, its marker pulses, then it settles to its result while the progress line advances. */
function buildRun(scope: HTMLElement) {
  const rows = gsap.utils.toArray<HTMLElement>('[data-log-row]', scope)
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } })
  tl.set('[data-log-progress]', { scaleX: 0 })
  rows.forEach((row, i) => {
    const pending = row.querySelector('[data-log-pending]')
    const done = row.querySelector('[data-log-done]')
    tl.fromTo(row, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, i === 0 ? 0 : '>+0.1')
      .fromTo(pending, { opacity: 1, scale: 1 }, { opacity: 0, scale: 2.6, duration: 0.45, ease: 'power2.out' }, '<')
      .fromTo(done, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3 }, '>-0.1')
      .to('[data-log-progress]', { scaleX: (i + 1) / rows.length, duration: 0.45, ease: 'power2.inOut' }, '<')
    if (row.hasAttribute('data-handoff')) {
      tl.fromTo(row, { backgroundColor: 'rgba(46,91,255,0)' }, { backgroundColor: 'rgba(46,91,255,0.16)', duration: 0.5 }, '<')
    }
  })
  return tl
}

/**
 * The hero's example agent run. It plays once, step by step, `startAt` seconds after mount; Replay plays it
 * again. Reduced-motion visitors, and the server render, get the finished run.
 */
export function AgentRunLog({ startAt = 1.6 }: { startAt?: number }) {
  const scope = useRef<HTMLDivElement>(null)
  const run = useRef<gsap.core.Timeline | null>(null)
  const [canReplay, setCanReplay] = useState(false)

  useGSAP(
    () =>
      withMotion(() => {
        run.current = buildRun(scope.current!).eventCallback('onComplete', () => setCanReplay(true))
        gsap.delayedCall(startAt, () => void run.current?.play())
        return () => {
          run.current = null
        }
      }),
    { scope }
  )

  // Restarts the existing timeline (no new tweens), so it needs no GSAP context.
  function replay() {
    setCanReplay(false)
    run.current?.restart()
  }

  return (
    <figure>
      <div
        ref={scope}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5">
          <p className="text-sm font-medium text-white">One request, handled end to end</p>
          {canReplay ? (
            <button
              type="button"
              onClick={replay}
              className="flex items-center gap-1.5 text-sm text-[var(--on-ink-blue)] transition-colors hover:text-white"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Replay
            </button>
          ) : (
            <span className="flex items-center gap-2 text-sm text-[var(--on-ink-soft)]">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-[var(--on-ink-blue)] opacity-60 motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--on-ink-blue)]" />
              </span>
              Agent run
            </span>
          )}
        </div>

        <div aria-hidden="true" className="h-px bg-white/10">
          <div data-log-progress className="h-px origin-left bg-[image:var(--accent-gradient)]" />
        </div>

        <ol className="divide-y divide-white/[0.08]">
          {RUN.map((step) => (
            <li
              key={step.time}
              data-log-row
              data-handoff={step.handoff ? '' : undefined}
              className={`grid grid-cols-[4.5rem_1fr_1.25rem] items-start gap-3 px-5 py-3.5 ${
                step.handoff ? 'bg-[rgba(46,91,255,0.16)]' : ''
              }`}
            >
              <time className="pt-[3px] font-mono text-xs tabular-nums text-white/55">{step.time}</time>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-medium leading-snug text-white">{step.action}</p>
                <p className="mt-0.5 text-sm leading-snug text-[var(--on-ink-soft)]">{step.detail}</p>
              </div>
              <span className="relative mt-0.5 flex h-5 w-5 items-center justify-center">
                <span data-log-pending aria-hidden="true" className="absolute h-2 w-2 rounded-full bg-[var(--on-ink-blue)] opacity-0" />
                {step.handoff ? (
                  <UserRound data-log-done aria-label="Handed to a person" className="h-4 w-4 text-[var(--on-ink-blue)]" />
                ) : (
                  <Check data-log-done aria-label="Done" className="h-4 w-4 text-[#5EE29A]" />
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-6 border-t border-white/10 px-5 py-3.5 text-sm text-[var(--on-ink-soft)]">
          <span>6 steps in 1 min 39 s</span>
          <span className="h-4 w-px bg-white/15" aria-hidden="true" />
          <span>1 handed to a person</span>
        </div>
      </div>
      <figcaption className="mt-4 max-w-[30rem] text-sm text-[var(--on-ink-soft)]">
        An example of the agents we build: they read the request, check your systems, act, and bring in your team
        when a decision needs a person.
      </figcaption>
    </figure>
  )
}
