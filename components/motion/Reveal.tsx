'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { motion } from 'motion/react'
import { rise, staggerContainer } from '@/lib/animations'

// Reveal-on-scroll building blocks usable from Server Components. Animations run once, when about a fifth of
// the element is in view. Under prefers-reduced-motion, MotionSafeProvider's MotionConfig turns the movement
// into a plain fade.

type DivProps = Omit<ComponentPropsWithoutRef<typeof motion.div>, 'children'> & { children: ReactNode }

export function Reveal({ children, ...props }: DivProps) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={rise} {...props}>
      {children}
    </motion.div>
  )
}

export function Stagger({ children, stagger = 0.1, ...props }: DivProps & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer(stagger)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...props }: DivProps) {
  return (
    <motion.div variants={rise} {...props}>
      {children}
    </motion.div>
  )
}
