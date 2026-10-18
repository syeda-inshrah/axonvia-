import type { Variants } from 'motion/react'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function staggerContainer(staggerDelay = 0.1): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  }
}

export const scatterIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

/** Axonvia's signature ease: a fast start that settles softly (ease-out-quint-like). */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Scroll reveal for cards and blocks: rises into place. Transform + opacity only, so it stays smooth on phones. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}
