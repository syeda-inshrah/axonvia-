// app/globals.test.ts
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

const css = readFileSync(path.join(__dirname, 'globals.css'), 'utf8')

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return ''
  return css.slice(start, css.indexOf('}', start) + 1)
}

describe('globals.css', () => {
  it('gives every focusable element a branded keyboard focus ring', () => {
    const focus = rule(':focus-visible')
    expect(focus).toMatch(/outline:\s*2px solid var\(--accent-cyan\)/)
    expect(focus).toMatch(/box-shadow:[^;]*var\(--border-glow\)/)
  })

  it('animates text-link underlines in from the left on hover', () => {
    expect(rule('.link-underline')).toMatch(/background-size:\s*0% 1px/)
    expect(rule('.link-underline')).toMatch(/transition:\s*background-size/)
    expect(rule('.link-underline:hover')).toMatch(/background-size:\s*100% 1px/)
  })

  it('blends alternate sections into their neighbours with 100px gradient zones, not a hard cut', () => {
    const blend = rule('.section-alt')
    expect(blend).toMatch(/linear-gradient\(\s*to bottom/)
    expect(blend).toContain('var(--bg-secondary) 100px')
    expect(blend).toContain('var(--bg-secondary) calc(100% - 100px)')
  })

  it('uses the blended background on every alternate section instead of a flat colour', () => {
    const dir = path.join(__dirname, '..', 'components', 'sections')
    const sources = readdirSync(dir)
      .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
      .map((file) => readFileSync(path.join(dir, file), 'utf8'))
    const sectionTags = sources.flatMap((source) => source.match(/<section[^>]*>/g) ?? [])

    expect(sectionTags.filter((tag) => tag.includes('bg-[var(--bg-secondary)]'))).toEqual([])
    expect(sectionTags.filter((tag) => tag.includes('section-alt'))).toHaveLength(5)
  })

  it('never blurs the animated headline words for visitors who prefer reduced motion', () => {
    const media = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(media).toMatch(/\[data-word\]\s*\{[^}]*filter:\s*none\s*!important/)
  })
})
