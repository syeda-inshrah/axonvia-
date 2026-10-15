// lib/animations.test.ts
import { describe, it, expect } from 'vitest'
import { fadeUp, staggerContainer } from './animations'

describe('animation variants', () => {
  it('fadeUp fades up from below', () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 24 })
    expect(fadeUp.visible).toMatchObject({ opacity: 1, y: 0 })
  })

  it('staggerContainer applies the given delay to children', () => {
    const variants = staggerContainer(0.2) as { visible: { transition: { staggerChildren: number } } }
    expect(variants.visible.transition.staggerChildren).toBe(0.2)
  })

  it('staggerContainer defaults to a 0.1s delay', () => {
    const variants = staggerContainer() as { visible: { transition: { staggerChildren: number } } }
    expect(variants.visible.transition.staggerChildren).toBe(0.1)
  })
})
