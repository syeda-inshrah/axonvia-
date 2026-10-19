'use client'

import { useRef } from 'react'
import { m, useInView } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

// Two soft light fields (electric blue and violet) drifting slowly behind navy surfaces. They are radial
// gradients rather than blurred blobs, so the GPU only moves two layers; the drift pauses off screen and is
// skipped entirely for visitors who prefer reduced motion.
const ORBS = [
  {
    className: 'left-[45%] top-[-30%] h-[70rem] w-[70rem]',
    color: 'rgba(46,91,255,0.38)',
    path: { x: [0, -120, 60, 0], y: [0, 80, 140, 0] },
    duration: 26,
  },
  {
    className: 'left-[-25%] top-[20%] h-[60rem] w-[60rem]',
    color: 'rgba(106,75,239,0.30)',
    path: { x: [0, 140, 40, 0], y: [0, -60, 80, 0] },
    duration: 32,
  },
]

export function Aurora({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = usePrefersReducedMotion()
  const drifting = inView && !reduced

  return (
    <div ref={ref} aria-hidden="true" data-drifting={drifting} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {ORBS.map((orb) => (
        <m.div
          key={orb.color}
          className={`absolute rounded-full will-change-transform ${orb.className}`}
          style={{ background: `radial-gradient(circle, ${orb.color} 0%, transparent 62%)` }}
          animate={drifting ? orb.path : { x: 0, y: 0 }}
          transition={drifting ? { duration: orb.duration, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
        />
      ))}
    </div>
  )
}
