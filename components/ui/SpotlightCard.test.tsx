// components/ui/SpotlightCard.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SpotlightCard } from './SpotlightCard'

describe('SpotlightCard', () => {
  it('moves its light to the mouse position through CSS variables', () => {
    render(<SpotlightCard>Card</SpotlightCard>)
    const card = screen.getByText('Card')
    card.getBoundingClientRect = () => ({ left: 10, top: 20 }) as DOMRect

    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: 110, clientY: 70 })

    expect(card.style.getPropertyValue('--spot-x')).toBe('100px')
    expect(card.style.getPropertyValue('--spot-y')).toBe('50px')
  })

  it('ignores touch, so scrolling on a phone never repositions the light', () => {
    render(<SpotlightCard>Card</SpotlightCard>)
    const card = screen.getByText('Card')

    fireEvent.pointerMove(card, { pointerType: 'touch', clientX: 110, clientY: 70 })

    expect(card.style.getPropertyValue('--spot-x')).toBe('')
  })
})
