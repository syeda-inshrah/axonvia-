// components/ui/TiltCard.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const motionPrefs = vi.hoisted(() => ({ reduced: false }))
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motionPrefs.reduced,
}))

import { TiltCard } from './TiltCard'

describe('TiltCard', () => {
  it('renders its content inside the card', () => {
    render(<TiltCard>Card body</TiltCard>)
    expect(screen.getByText('Card body').closest('[data-tilt-card]')).toBeInTheDocument()
  })

  it('is a 3D surface when motion is allowed (its tilt runs on springs driven by the pointer)', () => {
    const { container } = render(<TiltCard>Card</TiltCard>)
    const card = container.querySelector<HTMLElement>('[data-tilt-card]')!
    expect(card.style.transformStyle).toBe('preserve-3d')
  })

  it('stays flat for visitors who prefer reduced motion', () => {
    motionPrefs.reduced = true
    try {
      const { container } = render(<TiltCard>Card</TiltCard>)
      const card = container.querySelector<HTMLElement>('[data-tilt-card]')!
      fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: 200, clientY: 0 })
      expect(card.style.transform).toBe('')
      expect(card.style.transformStyle).toBe('')
    } finally {
      motionPrefs.reduced = false
    }
  })

  it('ignores touch, so scrolling on a phone never tilts it', () => {
    const { container } = render(<TiltCard>Card</TiltCard>)
    const card = container.querySelector<HTMLElement>('[data-tilt-card]')!
    const before = card.style.transform
    fireEvent.pointerMove(card, { pointerType: 'touch', clientX: 200, clientY: 0 })
    expect(card.style.transform).toBe(before)
  })
})
