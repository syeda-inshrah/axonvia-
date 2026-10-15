'use client'

import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

export function MotionSafeProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion ? 'true' : 'false')
  }, [prefersReducedMotion])

  return <>{children}</>
}
