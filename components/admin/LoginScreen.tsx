'use client'

import { m, useReducedMotion } from 'motion/react'
import { Logo } from '@/components/ui/Logo'
import { LoginForm, loginRow as row } from '@/components/admin/LoginForm'

// Three soft light fields (cyan, electric blue, violet) drifting slowly over deep navy. Plain radial gradients moved
// with transforms, so the compositor does the work; held still for visitors who prefer reduced motion.
const ORBS = [
  { className: '-left-[20%] -top-[25%] h-[42rem] w-[42rem]', color: 'rgba(34,211,238,0.22)', drift: { x: [0, 80, 0], y: [0, 60, 0] }, duration: 18 },
  { className: '-right-[25%] top-[10%] h-[48rem] w-[48rem]', color: 'rgba(45,91,255,0.30)', drift: { x: [0, -90, 0], y: [0, 70, 0] }, duration: 22 },
  { className: '-bottom-[30%] left-[15%] h-[40rem] w-[40rem]', color: 'rgba(106,63,240,0.24)', drift: { x: [0, 60, 0], y: [0, -70, 0] }, duration: 26 },
]

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delayChildren: 0.15, staggerChildren: 0.07 },
  },
}

/**
 * The admin sign-in screen: a frosted-glass card on Axonvia navy, with a cyan-to-blue glowing edge. The card rises in
 * and its contents follow in sequence (Motion for React); MotionProvider's reducedMotion="user" drops the movement
 * for visitors who prefer reduced motion, leaving a fade.
 */
export function LoginScreen() {
  const reduced = useReducedMotion()

  return (
    <main className="on-ink relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050B1F] px-4 py-12 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {ORBS.map((orb) => (
          <m.div
            key={orb.color}
            data-login-orb
            className={`absolute rounded-full will-change-transform ${orb.className}`}
            style={{ background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)` }}
            animate={reduced ? undefined : orb.drift}
            transition={{ duration: orb.duration, ease: 'easeInOut', repeat: Infinity }}
          />
        ))}
        <div className="dot-grid absolute inset-0 opacity-60" />
      </div>

      <m.div variants={card} initial="hidden" animate="show" className="relative w-full max-w-[26rem]">
        {/* Glowing edge: a cyan-to-violet gradient one pixel outside the card, blurred into a soft halo behind it. */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[1.75rem] bg-[linear-gradient(140deg,rgba(94,230,255,0.55),rgba(45,91,255,0.25)_40%,rgba(106,63,240,0.45))]"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[linear-gradient(140deg,rgba(34,211,238,0.25),rgba(45,91,255,0.2),rgba(106,63,240,0.25))] opacity-70 blur-3xl"
        />

        <div className="relative rounded-[1.75rem] bg-[#0A1433]/75 px-6 py-9 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:px-9 sm:py-11">
          <m.div variants={row} className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.02em] text-white">
            <Logo className="h-8 w-8" />
            Axonvia
            <span className="ml-1 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-[#AEB9D8]">
              Admin
            </span>
          </m.div>

          <m.h1 variants={row} className="mt-8 text-[1.75rem] font-semibold tracking-[-0.03em] text-white">
            Sign in
          </m.h1>
          <m.p variants={row} className="mb-7 mt-1.5 text-sm text-[#AEB9D8]">
            For Axonvia team members only.
          </m.p>

          <LoginForm />
        </div>
      </m.div>
    </main>
  )
}
