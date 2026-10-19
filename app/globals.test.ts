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

  it('leaves card transforms to GSAP (CSS animates only the shadow) and forces them off under reduced motion', () => {
    expect(rule('.spotlight-card')).toMatch(/transition:\s*box-shadow/)
    expect(rule('.spotlight-card')).not.toMatch(/transition:[^;]*transform/)
    const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduced).toMatch(/\.spotlight-card:hover\s*\{\s*transform:\s*none !important/)
  })

  it('hides intro and reveal content before GSAP plays it only when scripts run and motion is welcome', () => {
    const media = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'))
    expect(media).toMatch(/html\.js:not\(\.intro-timeout\) \[data-intro\]\s*\{\s*visibility:\s*hidden/)
    // Reveals fade with opacity, never visibility, so unrevealed content stays in the accessibility tree.
    expect(media).toMatch(/html\.js:not\(\.intro-timeout\) \[data-reveal\]\s*\{\s*opacity:\s*0/)
  })
})
