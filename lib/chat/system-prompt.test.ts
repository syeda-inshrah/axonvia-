// lib/chat/system-prompt.test.ts
import { describe, expect, it } from 'vitest'
import { buildSystemPrompt, SITE_KNOWLEDGE } from './system-prompt'

describe('chatbot system prompt', () => {
  it('covers every service and the engagement process the site publishes', () => {
    for (const service of [
      'AI Agent Development',
      'Workflow Automation',
      'AI-Powered Products',
      'Conversational AI & Chatbots',
      'Data & Integration',
      'AI Strategy & Consulting',
    ]) {
      expect(SITE_KNOWLEDGE).toContain(service)
    }
    expect(SITE_KNOWLEDGE).toContain('Discovery Call')
  })

  it('steers visitors to the contact form and forbids inventing prices, clients, or results', () => {
    const prompt = buildSystemPrompt([])
    expect(prompt).toMatch(/contact form/i)
    expect(prompt).toMatch(/never invent/i)
    expect(prompt).toMatch(/pricing|prices/i)
  })

  it('keeps the stable instructions first and appends owner-published FAQs after them', () => {
    const prompt = buildSystemPrompt([
      { id: '1', question: 'Do you work remotely?', answer: 'Yes.', isPublished: true, sortOrder: 0 },
    ])
    expect(prompt.indexOf('Rules:')).toBeLessThan(prompt.indexOf('Q: Do you work remotely?\nA: Yes.'))
  })

  it('adds no FAQ section when none are published', () => {
    expect(buildSystemPrompt([])).not.toMatch(/Frequently asked questions/)
  })
})
