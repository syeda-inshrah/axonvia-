import type { Variants } from 'motion/react'

/** Axonvia's one easing curve: a quick start that settles softly. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Scroll reveal: rises a short distance and fades in. Transform + opacity only, so it stays smooth on phones. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export function stagger(gap = 0.08, delayChildren = 0): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren } } }
}
