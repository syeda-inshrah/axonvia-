'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

const MAX_TILT = 4 // degrees

/**
 * Card that answers the pointer: its light follows the mouse (CSS variables, no re-render), and it lifts and
 * tilts slightly toward the cursor (GSAP quickTo, so rapid moves stay smooth). Touch only gets the static
 * hover styles, and reduced-motion visitors get no lift or tilt.
 */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const card = useRef<HTMLDivElement>(null)
  const tilt = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; lift: gsap.QuickToFunc } | null>(null)

  useGSAP(
    () =>
      withMotion(() => {
        const options = { duration: 0.6, ease: 'power3.out' }
        gsap.set(card.current, { transformPerspective: 900 })
        tilt.current = {
          x: gsap.quickTo(card.current, 'rotationY', options),
          y: gsap.quickTo(card.current, 'rotationX', options),
          lift: gsap.quickTo(card.current, 'y', options),
        }
        return () => {
          tilt.current = null
        }
      }),
    { scope: card }
  )

  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    event.currentTarget.style.setProperty('--spot-x', `${x}px`)
    event.currentTarget.style.setProperty('--spot-y', `${y}px`)
    tilt.current?.x(((x / box.width) * 2 - 1) * MAX_TILT)
    tilt.current?.y(-((y / box.height) * 2 - 1) * MAX_TILT)
    tilt.current?.lift(-4)
  }

  function settle() {
    tilt.current?.x(0)
    tilt.current?.y(0)
    tilt.current?.lift(0)
  }

  return (
    <div
      ref={card}
      onPointerMove={track}
      onPointerLeave={settle}
      className={`spotlight-card rounded-2xl border border-[var(--rule)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  )
}
