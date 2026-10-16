// components/sections/About.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { About } from './About'

describe('About', () => {
  it('renders the founder quote and stat row', () => {
    render(<About />)
    expect(screen.getByText(/We don't just talk about automation/)).toBeInTheDocument()
    expect(screen.getByText('Multi-agent systems')).toBeInTheDocument()
    // Unverified headcount claim stays out until confirmed by the founder.
    expect(screen.queryByText('5-person team')).not.toBeInTheDocument()
  })

  it('shows a styled founder-photo placeholder until a real photo is supplied', () => {
    render(<About />)
    expect(screen.getByTestId('founder-photo-placeholder').querySelector('svg')).toBeInTheDocument()
  })
})
