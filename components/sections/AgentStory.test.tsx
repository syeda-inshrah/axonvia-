// components/sections/AgentStory.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AgentStory } from './AgentStory'

describe('AgentStory', () => {
  it('tells the six steps of one request, in order, as a labelled section', () => {
    render(<AgentStory />)
    const section = screen.getByRole('region', { name: 'One request, handled end to end' })
    const titles = within(section).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(titles).toEqual([
      'A customer writes in',
      'It knows who is asking',
      'It checks the real calendar',
      'It replies in the same thread',
      'It does the booking',
      'It knows when to hand over',
    ])
  })

  it('says plainly that the run is an example', () => {
    render(<AgentStory />)
    expect(screen.getAllByText(/example/i).length).toBeGreaterThan(0)
  })

  it('shows the finished run when no scroll animation runs: whole conversation, every action done, the handoff last', () => {
    render(<AgentStory />)
    expect(screen.getByText('Hi! Can I move Thursday’s appointment to Friday afternoon?')).toBeInTheDocument()
    expect(screen.getByText('Handed to Sara (front desk) with the full conversation')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Done')).toHaveLength(5)
    expect(screen.getAllByLabelText('Handed to a person')).toHaveLength(1)
  })

  it('marks the step currently being told for assistive tech', () => {
    render(<AgentStory />)
    const current = document.querySelector('[aria-current="step"]')
    expect(current).toHaveTextContent('It knows when to hand over')
  })

  it('is the target of the hero’s "See an agent at work" link', () => {
    render(<AgentStory />)
    expect(screen.getByRole('region', { name: 'One request, handled end to end' })).toHaveAttribute('id', 'story')
  })
})
