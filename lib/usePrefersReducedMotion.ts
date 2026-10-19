'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function query(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null
}

function subscribe(onChange: () => void) {
  const list = query()
  list?.addEventListener?.('change', onChange)
  return () => list?.removeEventListener?.('change', onChange)
}

/**
 * True when the visitor asks for reduced motion. The server (and hydration) always render as "no preference",
 * so markup never mismatches; the real value takes over right after hydration and follows live changes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => query()?.matches === true,
    () => false
  )
}
