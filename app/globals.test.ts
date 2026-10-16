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
  it('gives every focusable element a branded keyboard focus ring', () => {
    const focus = rule(':focus-visible')
    expect(focus).toMatch(/outline:\s*2px solid var\(--accent-cyan\)/)
    expect(focus).toMatch(/box-shadow:[^;]*var\(--border-glow\)/)
  })
})
