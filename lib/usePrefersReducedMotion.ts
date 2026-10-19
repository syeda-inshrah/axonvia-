'use client'

import { useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

const noSubscription = () => () => {}

/**
 * Motion's useReducedMotion() is already true on the client's first render, but the server always renders
 * as "no preference" — branching markup on it causes a hydration mismatch. This reports false until mounted.
 */
export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion()
  // false while server-rendering and hydrating, true once running on the client — without an extra
  // setState-in-effect render.
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  )
  return mounted && reduced === true
}
