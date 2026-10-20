'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

// Motion for React drives the interactive pieces (tilt cards, magnetic buttons, the story console, the chat
// panel); GSAP + ScrollTrigger drives everything tied to scroll. LazyMotion with `m` components ships only the
// DOM animation features, and strict mode fails loudly if a full `motion` component slips in.
// reducedMotion="user": Motion drops transform animations for visitors who prefer reduced motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
