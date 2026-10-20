'use client'

import { Fragment, useRef } from 'react'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

/**
 * A large serif statement read in step with the scroll: each word brightens from muted to full ink as the
 * passage moves up the screen (ScrollTrigger scrub). The text is ordinary text throughout; without motion it
 * simply shows at full strength.
 */
export function ScrollStatement({ text, className = '' }: { text: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.fromTo(
          '[data-statement-word]',
          // Navy at 55% over the page measures about 4:1, so even unread words meet the 3:1 large-text minimum.
          { opacity: 0.55 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
          }
        )
      }),
    { scope: root }
  )

  return (
    <p ref={root} data-statement className={className}>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span data-statement-word>{word}</span>
        </Fragment>
      ))}
    </p>
  )
}
