import type { Variants } from 'framer-motion'

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
