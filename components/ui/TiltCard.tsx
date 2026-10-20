'use client'

import type { PointerEvent, ReactNode } from 'react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

const MAX_TILT = 7 // degrees
const SPRING = { stiffness: 180, damping: 18, mass: 0.5 }

/**
 * A card that answers the pointer in 3D (Motion for React): it tilts toward the cursor on springs, lifts, and a
 * soft glare follows the pointer across its surface, with a blue-to-violet hairline on hover. Mouse only, so
 * touch scrolling never tilts it; still for visitors who prefer reduced motion.
 */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useSpring(0, SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), SPRING)
  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), SPRING)
  const lift = useTransform(hover, [0, 1], [0, -6])
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.75), rgba(45,91,255,0.07) 35%, transparent 65%)`

  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reduced) return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width)
    py.set((event.clientY - box.top) / box.height)
    hover.set(1)
  }

  function settle() {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <div className="h-full [perspective:1200px]">
      <m.div
        data-tilt-card
        onPointerMove={track}
        onPointerLeave={settle}
        style={reduced ? undefined : { rotateX, rotateY, y: lift, transformStyle: 'preserve-3d' }}
        className={`group relative h-full overflow-hidden rounded-3xl border border-[var(--rule)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-raised)] ${className}`}
      >
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] group-hover:opacity-100 group-focus-within:opacity-100"
          style={{ background: 'linear-gradient(140deg, rgba(45,91,255,0.6), rgba(106,63,240,0.5) 55%, transparent)' }}
        />
        <div className="relative flex h-full flex-col">{children}</div>
      </m.div>
    </div>
  )
}
