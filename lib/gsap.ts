'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Axonvia's one easing curve: a quick start that settles softly. */
export const EASE = 'expo.out'

/**
 * Runs `setup` only for visitors without a reduced-motion preference, and reverts everything it created when
 * the preference changes or the component unmounts. Environments without matchMedia (tests) get the static page.
 */
export function withMotion(setup: () => void | (() => void)) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', setup)
  return () => mm.revert()
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
