'use client'

import type { PointerEvent, ReactNode } from 'react'
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Wraps a call to action so it leans a few pixels toward the cursor and springs back when it leaves
 * (Motion for React). Mouse only, and still for visitors who prefer reduced motion.
 */
export function MagneticButton({ children, className = '', strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const reduced = useReducedMotion()

  function follow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reduced) return
    const box = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (box.left + box.width / 2)) * strength)
    y.set((event.clientY - (box.top + box.height / 2)) * strength)
  }

  function release() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div onPointerMove={follow} onPointerLeave={release} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </m.div>
  )
}
