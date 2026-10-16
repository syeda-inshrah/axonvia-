// components/sections/Process.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Process } from './Process'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

describe('Process', () => {
  it('renders all 5 engagement steps', () => {
    render(<Process />)
    expect(screen.getByText('Discovery Call')).toBeInTheDocument()
    expect(screen.getByText('Proposal & Scope')).toBeInTheDocument()
    expect(screen.getByText('Build Sprint')).toBeInTheDocument()
    expect(screen.getByText('Testing & Handoff')).toBeInTheDocument()
    expect(screen.getByText('Support & Iteration')).toBeInTheDocument()
  })

  it('draws the connecting line as the visitor scrolls', () => {
    const { container } = render(<Process />)
    expect(container.querySelector('[data-timeline-fill="vertical"]')).toHaveAttribute('data-scroll-linked', 'true')
  })

  it('shows the line fully drawn for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<Process />)
      expect(container.querySelector('[data-timeline-fill="vertical"]')).toHaveAttribute('data-scroll-linked', 'false')
    } finally {
      motionPrefs.reduced = false
    }
  })
})
