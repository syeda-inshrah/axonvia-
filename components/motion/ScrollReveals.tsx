'use client'

import { gsap, ScrollTrigger, useGSAP, withMotion, EASE } from '@/lib/gsap'

/**
 * One ScrollTrigger batch for the whole page: every element marked `data-reveal` rises into place the first
 * time it scrolls into view, and elements that arrive together stagger. Sections stay Server Components and
 * only carry the attribute. Under reduced motion nothing is hidden or moved.
 */
export function ScrollReveals() {
  useGSAP(() =>
    withMotion(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      // Opacity only (never visibility), so unrevealed content stays available to assistive technology.
      gsap.set(targets, { opacity: 0, y: 28 })
      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        interval: 0.08,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.09, overwrite: true }),
      })
    })
  )
  return null
}
