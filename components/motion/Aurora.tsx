'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, withMotion } from '@/lib/gsap'

// Two soft light fields (electric blue and violet) drifting slowly behind navy surfaces. They are radial
// gradients rather than blurred blobs, so the GPU only moves two layers; the drift pauses while off screen
// and is skipped entirely for visitors who prefer reduced motion.
const ORBS = [
  {
    className: 'left-[45%] top-[-30%] h-[70rem] w-[70rem]',
    color: 'rgba(46,91,255,0.38)',
    drift: { x: -140, y: 120 },
    duration: 13,
  },
  {
    className: 'left-[-25%] top-[20%] h-[60rem] w-[60rem]',
    color: 'rgba(106,75,239,0.30)',
    drift: { x: 160, y: -80 },
    duration: 16,
  },
]

export function Aurora({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        const tweens = gsap.utils.toArray<HTMLElement>('[data-orb]').map((orb, i) =>
          gsap.to(orb, { ...ORBS[i].drift, duration: ORBS[i].duration, ease: 'sine.inOut', repeat: -1, yoyo: true })
        )
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: ({ isActive }) => tweens.forEach((tween) => (isActive ? tween.resume() : tween.pause())),
        })
      }),
    { scope: root }
  )

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {ORBS.map((orb) => (
        <div
          key={orb.color}
          data-orb
          className={`absolute rounded-full will-change-transform ${orb.className}`}
          style={{ background: `radial-gradient(circle, ${orb.color} 0%, transparent 62%)` }}
        />
      ))}
    </div>
  )
}
