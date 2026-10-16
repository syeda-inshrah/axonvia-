// lib/animations.test.ts
import { describe, it, expect } from 'vitest'
import { fadeUp, scatterIn, staggerContainer } from './animations'

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

  it('scatterIn settles chips into place from 90% scale', () => {
    expect(scatterIn.hidden).toEqual({ opacity: 0, scale: 0.9 })
    expect(scatterIn.visible).toMatchObject({ opacity: 1, scale: 1 })
  })
})
