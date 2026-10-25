'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Axonvia's one easing curve: a quick start that settles softly. */
export const EASE = 'expo.out'

/**
 * Runs `setup` only for visitors without a reduced-motion preference (and, if given, matching `extraQuery`, e.g.
 * '(min-width: 768px)'), and reverts everything it created when that stops matching or the component unmounts.
 * Environments without matchMedia get the static page.
 */
export function withMotion(setup: () => void | (() => void), extraQuery?: string) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  const mm = gsap.matchMedia()
  mm.add(`(prefers-reduced-motion: no-preference)${extraQuery ? ` and ${extraQuery}` : ''}`, setup)
  return () => mm.revert()
}

export { gsap, ScrollTrigger, useGSAP }
