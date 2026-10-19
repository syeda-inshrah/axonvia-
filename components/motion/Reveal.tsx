'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { m } from 'motion/react'
import { rise, stagger } from '@/lib/motion'

// Reveal-on-scroll building blocks usable from Server Components. Each runs once, when a fifth of the
// element is in view. Under reduced motion, MotionSafeProvider's MotionConfig turns the rise into a plain fade.

type DivProps = Omit<ComponentPropsWithoutRef<typeof m.div>, 'children'> & { children: ReactNode }

export function Reveal({ children, ...props }: DivProps) {
  return (
    <m.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={rise} {...props}>
      {children}
    </m.div>
  )
}

export function Stagger({ children, gap = 0.08, ...props }: DivProps & { gap?: number }) {
  return (
    <m.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger(gap)} {...props}>
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, ...props }: DivProps) {
  return (
    <m.div variants={rise} {...props}>
      {children}
    </m.div>
  )
}
