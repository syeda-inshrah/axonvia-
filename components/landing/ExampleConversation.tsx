'use client'

import { useRef } from 'react'
import { Logo } from '@/components/ui/Logo'
import { EASE, gsap, useGSAP, withMotion } from '@/lib/gsap'
import type { LandingPageContent } from '@/lib/landing-pages'

/**
 * The landing hero's illustration: a short example conversation in the style of the homepage's agent story.
 * Bubbles rise in one after another; reduced-motion visitors (and no script) see the finished conversation.
 * Labelled as an example so it is never read as a real client.
 */
export function ExampleConversation({ example }: { example: LandingPageContent['example'] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('[data-example-line]', { opacity: 0, y: 14, scale: 0.97, duration: 0.6, ease: EASE, stagger: 0.45, delay: 0.4 })
      }),
    { scope: root }
  )

  return (
    <div ref={root} className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[var(--shadow-raised)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] bg-[image:var(--accent-gradient-soft)] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">{example.channel}</p>
        </div>
        <span className="rounded-full border border-[var(--rule-strong)] bg-white/80 px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
          {example.title}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 p-5">
        {example.lines.map((line, i) => (
          <p
            key={i}
            data-example-line
            className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[0.875rem] leading-snug ${
              line.from === 'customer'
                ? 'self-start rounded-bl-md bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                : line.from === 'agent'
                  ? 'self-end rounded-br-md bg-[image:var(--accent-gradient)] text-white'
                  : 'self-center rounded-full border border-[var(--border-glow-alt)] bg-[var(--tint-violet)] px-3 py-1 text-center text-xs text-[var(--accent-purple)]'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
      <p className="border-t border-[var(--rule)] px-5 py-3 text-xs text-[var(--text-muted)]">
        Illustrative example; names and details are fictional.
      </p>
    </div>
  )
}
