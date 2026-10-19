// components/sections/Process.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Process } from './Process'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

describe('Process', () => {
  it('renders all 5 engagement steps, in order', () => {
    render(<Process />)
    const steps = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(steps).toEqual(['Discovery Call', 'Proposal & Scope', 'Build Sprint', 'Testing & Handoff', 'Support & Iteration'])
  })

  it('is the target of the "How it works" navigation link', () => {
    render(<Process />)
    expect(screen.getByRole('region', { name: 'From first call to live system' })).toHaveAttribute('id', 'how-it-works')
  })

  it('draws the line with the scrollbar', () => {
    const { container } = render(<Process />)
    expect(container.querySelector('[data-process-line]')).toHaveAttribute('data-scroll-linked', 'true')
  })

  it('shows the line drawn and every step lit for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<Process />)
      const line = container.querySelector('[data-process-line]')
      expect(line).toHaveAttribute('data-scroll-linked', 'false')
      expect(line).not.toHaveAttribute('style')
      for (const lit of container.querySelectorAll('[data-step-lit]')) expect(lit).not.toHaveAttribute('style')
    } finally {
      motionPrefs.reduced = false
    }
  })
})
