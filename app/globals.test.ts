// app/globals.test.ts
import { readFileSync } from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

const css = readFileSync(path.join(__dirname, 'globals.css'), 'utf8')

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return ''
  return css.slice(start, css.indexOf('}', start) + 1)
}

describe('globals.css', () => {
  it('gives every focusable element a solid blue keyboard focus ring, switched to white on the navy panel', () => {
    expect(rule(':focus-visible')).toMatch(/outline:\s*2px solid var\(--accent-cyan\)/)
    expect(rule('.on-ink :focus-visible')).toMatch(/outline-color:\s*#FFFFFF/i)
  })

  it('animates text-link underlines in from the left on hover', () => {
    expect(rule('.link-underline')).toMatch(/background-size:\s*0% 1px/)
    expect(rule('.link-underline')).toMatch(/transition:\s*background-size/)
    expect(rule('.link-underline:hover')).toMatch(/background-size:\s*100% 1px/)
  })

  it('gives alternate sections a flat wash rather than a gradient', () => {
    const wash = rule('.section-alt')
    expect(wash).toMatch(/background-color:\s*var\(--bg-secondary\)/)
    expect(wash).not.toContain('gradient')
  })

  it('lights spotlight cards with transform and opacity only, and keeps them still under reduced motion', () => {
    expect(rule('.spotlight-card')).toMatch(/transition:\s*transform[^;]*box-shadow/)
    const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduced).toMatch(/\.spotlight-card:hover\s*\{\s*transform:\s*none/)
  })
})
