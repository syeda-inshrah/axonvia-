// components/sections/Services.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders "AI automation services" with exactly the five services, in order', () => {
    render(<Services />)
    expect(screen.getByRole('heading', { level: 2, name: 'AI automation services' })).toBeInTheDocument()
    expect(screen.getByText('From a single automated workflow to a complete AI system, built around your business.')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents, Chatbots & Voice Agents',
      'Custom AI-Powered Software',
      'System Integration & Workflow Design',
    ])
  })

  it('gives each service its description and example bullets', () => {
    render(<Services />)
    const card = screen.getByRole('heading', { name: 'Intelligent Lead Management' }).closest('li')!
    expect(card).toHaveTextContent(/Capture leads automatically/)
    for (const example of ['Instant replies to new enquiries', 'Automatic follow-up sequences', 'Calendar booking & reminders']) {
      expect(within(card).getByText(example)).toBeInTheDocument()
    }
  })

  it('links each card to the page that covers it in depth, chatbots and voice agents included', () => {
    render(<Services />)
    const card = screen.getByRole('heading', { name: 'AI Agents, Chatbots & Voice Agents' }).closest('li')!
    expect(within(card).getByRole('link', { name: /AI chatbots/ })).toHaveAttribute('href', '/ai-chatbots')
    expect(within(card).getByRole('link', { name: /AI voice agents/ })).toHaveAttribute('href', '/ai-voice-agents')
    const leads = screen.getByRole('heading', { name: 'Intelligent Lead Management' }).closest('li')!
    expect(within(leads).getByRole('link', { name: /For real estate/ })).toHaveAttribute('href', '/real-estate-ai-automation')
    for (const item of screen.getAllByRole('listitem').filter((li) => li.querySelector('h3'))) {
      expect(within(item).getAllByRole('link').length).toBeGreaterThan(0)
    }
  })
})
