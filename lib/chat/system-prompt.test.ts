// lib/chat/system-prompt.test.ts
import { describe, expect, it } from 'vitest'
import { buildSystemPrompt, SITE_KNOWLEDGE } from './system-prompt'

describe('chatbot system prompt', () => {
  it('covers every service and the engagement process the site publishes', () => {
    for (const service of [
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents & Intelligent Assistants',
      'Custom AI-Powered Software',
      'System Integration & Workflow Design',
    ]) {
      expect(SITE_KNOWLEDGE).toContain(service)
    }
    expect(SITE_KNOWLEDGE).toContain('Free Discovery Call')
    expect(SITE_KNOWLEDGE).toContain('AI that works for your business.')
    expect(SITE_KNOWLEDGE).toMatch(/free automation audit/i)
    // Calling is an option inside AI Agents, not the headline.
    expect(SITE_KNOWLEDGE).toMatch(/voice or calling agents are available as part of AI Agents/i)
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
