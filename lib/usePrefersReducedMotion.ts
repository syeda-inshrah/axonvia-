'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Framer's useReducedMotion() is already true on the client's first render, but the server always renders
 * as "no preference" — branching markup on it causes a hydration mismatch. This reports false until mounted.
 */
export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && reduced === true
}
