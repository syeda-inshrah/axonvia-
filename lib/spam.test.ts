// lib/spam.test.ts
import { describe, expect, it } from 'vitest'
import { looksAutomated } from './spam'

function form(fields: Record<string, string>) {
  const fd = new FormData()
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value))
  return fd
}

describe('looksAutomated', () => {
  const now = 1_000_000

  it('flags a filled-in honeypot field', () => {
    expect(looksAutomated(form({ website: 'http://spam.example' }), now)).toBe(true)
  })

  it('flags a form submitted faster than a person could fill it in', () => {
    expect(looksAutomated(form({ startedAt: String(now - 800) }), now)).toBe(true)
  })

  it('lets through a normal submission, including one with no start time recorded', () => {
    expect(looksAutomated(form({ website: '', startedAt: String(now - 9000) }), now)).toBe(false)
    expect(looksAutomated(form({}), now)).toBe(false)
  })
})
