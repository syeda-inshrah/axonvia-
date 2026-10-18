'use client'

import { useEffect } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'

export function MotionSafeProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion ? 'true' : 'false')
  }, [prefersReducedMotion])

  // reducedMotion="user": Framer skips transform animations (the fade-up's y-offset) but keeps opacity fades.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
