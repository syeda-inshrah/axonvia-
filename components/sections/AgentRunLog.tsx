'use client'

import { useEffect, useState } from 'react'
import { useAnimate, useReducedMotion, type AnimationSequence } from 'motion/react'
import { Check, RotateCcw, UserRound } from 'lucide-react'
import { EASE } from '@/lib/motion'

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
function runSequence(startAt: number): AnimationSequence {
  const sequence: AnimationSequence = [['[data-log-progress]', { scaleX: 0 }, { duration: 0 }]]
  RUN.forEach((step, i) => {
    const row = `[data-log-row="${i}"]`
    sequence.push(
      [row, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, ease: EASE, at: i === 0 ? startAt : '+0.12' }],
      [`${row} [data-log-pending]`, { opacity: [1, 0], scale: [1, 2.6] }, { duration: 0.45, at: '<' }],
      [`${row} [data-log-done]`, { opacity: [0, 1], scale: [0.4, 1] }, { duration: 0.3, ease: EASE, at: '+0.05' }],
      ['[data-log-progress]', { scaleX: (i + 1) / RUN.length }, { duration: 0.45, ease: 'easeInOut', at: '<' }]
    )
    if (step.handoff) {
      sequence.push([row, { backgroundColor: ['rgba(46,91,255,0)', 'rgba(46,91,255,0.16)'] }, { duration: 0.6, at: '<' }])
    }
  })
  return sequence
}

/**
 * The hero's example agent run. It plays once, step by step, after the hero intro; Replay plays it again.
 * Reduced-motion visitors, and the server render, get the finished run.
 */
export function AgentRunLog({ startAt = 1.6 }: { startAt?: number }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reduced = useReducedMotion()
  // Starts as playing: the first run begins on mount, and Replay only shows once a run has finished.
  const [playing, setPlaying] = useState(true)

  function run(delay: number) {
    animate('[data-log-row]', { opacity: 0 }, { duration: 0 })
    animate('[data-log-done]', { opacity: 0 }, { duration: 0 })
    return animate(runSequence(delay)).then(() => setPlaying(false))
  }

  function replay() {
    setPlaying(true)
    void run(0.2)
  }

  useEffect(() => {
    if (reduced) return
    void run(startAt)
    // Plays once on mount; replays come only from the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <figure>
      <div
        ref={scope}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5">
          <p className="text-sm font-medium text-white">One request, handled end to end</p>
          {!reduced && !playing ? (
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
          {RUN.map((step, i) => (
            <li
              key={step.time}
              data-log-row={i}
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
