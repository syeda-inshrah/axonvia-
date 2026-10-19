// components/sections/About.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { About } from './About'

describe('About', () => {
  it('renders the founder quote and the confirmed facts', () => {
    render(<About />)
    expect(screen.getByText(/We don't just talk about automation/)).toBeInTheDocument()
    expect(screen.getByText('Multi-agent systems')).toBeInTheDocument()
    expect(screen.getByText('Karachi, Pakistan')).toBeInTheDocument()
    // Unverified headcount claim stays out until confirmed by the founder.
    expect(screen.queryByText('5-person team')).not.toBeInTheDocument()
  })

  it('shows no stand-in portrait until a real founder photo is supplied', () => {
    const { container } = render(<About />)
    expect(container.querySelector('img, svg')).toBeNull()
  })
})
