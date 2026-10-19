'use client'

import { useEffect } from 'react'
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react'

export function MotionSafeProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion ? 'true' : 'false')
  }, [prefersReducedMotion])

  // reducedMotion="user": Motion skips transform animations (a reveal's y-offset) but keeps opacity fades.
  // LazyMotion + `m` components ship only the animation features the site uses (no drag or layout), and
  // strict mode fails loudly if a full `motion` component slips back in.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
