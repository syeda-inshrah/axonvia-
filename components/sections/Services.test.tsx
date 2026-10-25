// components/sections/Services.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders "What we build" with exactly the five services, in order', () => {
    render(<Services />)
    expect(screen.getByRole('heading', { level: 2, name: 'What we build' })).toBeInTheDocument()
    expect(screen.getByText('From a single automated workflow to a complete AI system, built around your business.')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Business Process Automation',
      'Intelligent Lead Management',
      'AI Agents & Intelligent Assistants',
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

  it('mentions voice agents only as an option inside AI Agents, never as a service of its own', () => {
    render(<Services />)
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent ?? '')
    expect(headings.some((h) => /voice|call/i.test(h))).toBe(false)
    expect(screen.getByRole('heading', { name: 'AI Agents & Intelligent Assistants' }).closest('li')).toHaveTextContent(/including voice agents/)
  })
})
