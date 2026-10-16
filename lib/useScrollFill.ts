'use client'

import type { RefObject } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/**
 * 0→1 progress of a timeline line as its container scrolls through the viewport.
 * Reduced-motion visitors get a fully drawn line (1) instead of a scroll-linked one.
 */
export function useScrollFill(target: RefObject<HTMLElement | null>): MotionValue<number> | 1 {
  const { scrollYProgress } = useScroll({ target, offset: ['start 80%', 'end 60%'] })
  const reduced = usePrefersReducedMotion()
  return reduced ? 1 : scrollYProgress
}
