// components/sections/TechStack.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TechStack } from './TechStack'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

describe('TechStack', () => {
  it('renders the stack chips, including Neon in place of the unused Supabase', () => {
    render(<TechStack />)

    expect(screen.getByText('Claude API')).toBeInTheDocument()
    expect(screen.getByText('Neon')).toBeInTheDocument()
    expect(screen.queryByText('Supabase')).not.toBeInTheDocument()
    expect(screen.getByText('WhatsApp API')).toBeInTheDocument()
  })

  it('floats every chip with its own phase', () => {
    const { container } = render(<TechStack />)
    const floating = container.querySelectorAll('[data-floating="true"]')
    expect(floating).toHaveLength(14)
    const delays = new Set(Array.from(floating, (chip) => chip.getAttribute('data-float-delay')))
    expect(delays.size).toBeGreaterThan(1)
  })

  it('keeps chips still for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<TechStack />)
      expect(container.querySelectorAll('[data-floating="true"]')).toHaveLength(0)
    } finally {
      motionPrefs.reduced = false
    }
  })
})
