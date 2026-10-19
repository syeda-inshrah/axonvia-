// components/motion/Aurora.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Aurora } from './Aurora'

const motion = vi.hoisted(() => ({ reduced: false, inView: true }))
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motion.reduced,
  useInView: () => motion.inView,
}))

function drifting() {
  const { container, unmount } = render(<Aurora />)
  const value = container.firstElementChild!.getAttribute('data-drifting')
  unmount()
  return value
}

describe('Aurora', () => {
  it('is decorative, hidden from assistive tech', () => {
    const { container } = render(<Aurora />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('drifts while on screen', () => {
    expect(drifting()).toBe('true')
  })

  it('stops drifting off screen, so it costs nothing while scrolled past', () => {
    motion.inView = false
    try {
      expect(drifting()).toBe('false')
    } finally {
      motion.inView = true
    }
  })

  it('stays still for visitors who prefer reduced motion', () => {
    motion.reduced = true
    try {
      expect(drifting()).toBe('false')
    } finally {
      motion.reduced = false
    }
  })
})
