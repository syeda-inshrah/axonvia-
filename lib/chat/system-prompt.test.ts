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
    const [instructions] = buildSystemPrompt([])
    expect(instructions.text).toMatch(/contact form/i)
    expect(instructions.text).toMatch(/never invent/i)
    expect(instructions.text).toMatch(/pricing|prices/i)
  })

  it('keeps the stable instructions first and caches them; published FAQs go in a separate later block', () => {
    const blocks = buildSystemPrompt([
      { id: '1', question: 'Do you work remotely?', answer: 'Yes.', isPublished: true, sortOrder: 0 },
    ])
    expect(blocks).toHaveLength(2)
    expect(blocks[0].text).not.toContain('Do you work remotely?')
    expect(blocks[1].text).toContain('Q: Do you work remotely?\nA: Yes.')
    expect(blocks[1].cache_control).toEqual({ type: 'ephemeral' })
  })

  it('sends a single cached block when no FAQs are published', () => {
    const blocks = buildSystemPrompt([])
    expect(blocks).toHaveLength(1)
    expect(blocks[0].cache_control).toEqual({ type: 'ephemeral' })
  })
})
