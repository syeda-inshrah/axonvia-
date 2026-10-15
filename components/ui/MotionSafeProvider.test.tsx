// components/ui/MotionSafeProvider.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const useReducedMotion = vi.fn()
vi.mock('framer-motion', () => ({ useReducedMotion }))

describe('MotionSafeProvider', () => {
  beforeEach(() => useReducedMotion.mockReset())

  it('sets data-reduced-motion=true on the html element when preferred', async () => {
    useReducedMotion.mockReturnValue(true)
    const { MotionSafeProvider } = await import('./MotionSafeProvider')
    render(<MotionSafeProvider>child</MotionSafeProvider>)

    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true')
  })

  it('sets data-reduced-motion=false otherwise', async () => {
    useReducedMotion.mockReturnValue(false)
    const { MotionSafeProvider } = await import('./MotionSafeProvider')
    render(<MotionSafeProvider>child</MotionSafeProvider>)

    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('false')
  })
})
