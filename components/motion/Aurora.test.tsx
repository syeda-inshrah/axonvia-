// components/motion/Aurora.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Aurora } from './Aurora'

describe('Aurora', () => {
  it('is decorative, hidden from assistive tech and pointer events', () => {
    const { container } = render(<Aurora />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('pointer-events-none')
  })

  it('draws two light fields as gradients, not blurred layers', () => {
    const { container } = render(<Aurora />)
    const orbs = container.querySelectorAll<HTMLElement>('[data-orb]')
    expect(orbs).toHaveLength(2)
    for (const orb of orbs) {
      expect(orb.style.background).toMatch(/radial-gradient/)
      expect(orb.className).not.toMatch(/blur/)
    }
  })

  it('stays still when no motion runs (reduced motion, tests): no transforms are applied', () => {
    const { container } = render(<Aurora />)
    for (const orb of container.querySelectorAll<HTMLElement>('[data-orb]')) expect(orb.style.transform).toBe('')
  })
})
