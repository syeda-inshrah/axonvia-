// components/ui/MotionSafeProvider.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const useReducedMotion = vi.fn()
vi.mock('motion/react', () => ({
  useReducedMotion,
  MotionConfig: ({ reducedMotion, children }: { reducedMotion?: string; children: React.ReactNode }) => (
    <div data-testid="motion-config" data-reduced-motion-config={reducedMotion}>
      {children}
    </div>
  ),
}))

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

  it('tells Framer Motion to honor the user preference, so reveals drop their y-offset and keep only the fade', async () => {
    useReducedMotion.mockReturnValue(true)
    const { MotionSafeProvider } = await import('./MotionSafeProvider')
    render(<MotionSafeProvider>child</MotionSafeProvider>)

    expect(screen.getByTestId('motion-config')).toHaveAttribute('data-reduced-motion-config', 'user')
  })
})
