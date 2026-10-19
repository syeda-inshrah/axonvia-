// app/theme.test.ts
import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.join(__dirname, 'globals.css'), 'utf8')
const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')))

function token(name: string): string {
  const match = root.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!match) throw new Error(`missing token --${name}`)
  return match[1].trim()
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as [number, number, number]
}

// WCAG 2.x relative luminance and contrast ratio.
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('theme tokens', () => {
  it('uses an off-white page with deep navy text', () => {
    expect(Math.min(...hexToRgb(token('bg-primary')))).toBeGreaterThanOrEqual(0xf0) // off-white: near white
    expect(token('bg-primary').toUpperCase()).not.toBe('#FFFFFF')
    const [r, , b] = hexToRgb(token('text-primary'))
    expect(b).toBeGreaterThan(r) // navy: blue-dominant and dark
    expect(luminance(token('text-primary'))).toBeLessThan(0.05)
  })

  it.each(['bg-primary', 'bg-secondary'])('keeps every text colour readable (WCAG AA 4.5:1) on %s', (background) => {
    for (const foreground of ['text-primary', 'text-secondary', 'text-muted', 'accent-cyan', 'success', 'danger']) {
      expect(contrast(token(foreground), token(background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps button text readable across the whole accent gradient', () => {
    const stops = token('accent-gradient').match(/#[0-9A-Fa-f]{6}/g)!
    expect(stops.length).toBeGreaterThanOrEqual(2)
    for (const stop of stops) expect(contrast(token('on-accent'), stop), `on-accent on ${stop}`).toBeGreaterThanOrEqual(4.5)
  })
})

describe('components follow the theme tokens', () => {
  // Hard-coded colours from the old dark theme that would break on a white page.
  const DARK_THEME_COLOURS = [/#05070D/i, /#0A0E1A/i, /#0F1420/i, /rgba\(5,7,13/, /rgba\(15,20,32/, /rgba\(255,255,255,0\.0\d\)/, /text-red-400/]

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) return sourceFiles(full)
      return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : []
    })
  }

  it('contain none of the old dark-theme colours', () => {
    const offenders = ['app', 'components'].flatMap((dir) =>
      sourceFiles(path.join(__dirname, '..', dir)).flatMap((file) => {
        const source = readFileSync(file, 'utf8')
        return DARK_THEME_COLOURS.filter((pattern) => pattern.test(source)).map((pattern) => `${path.relative(path.join(__dirname, '..'), file)} ${pattern}`)
      })
    )
    expect(offenders).toEqual([])
  })
})
