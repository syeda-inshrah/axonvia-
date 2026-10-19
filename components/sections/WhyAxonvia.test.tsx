// components/sections/WhyAxonvia.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WhyAxonvia } from './WhyAxonvia'

describe('WhyAxonvia', () => {
  it('renders all 4 differentiators', () => {
    render(<WhyAxonvia />)
    expect(screen.getByText('Built, Not Templated')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Capability')).toBeInTheDocument()
    expect(screen.getByText('Transparent Process')).toBeInTheDocument()
    expect(screen.getByText('Long-Term Partnership')).toBeInTheDocument()
  })

  it('uses the spec headline as the H2 and the positioning line as supporting copy', () => {
    render(<WhyAxonvia />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Not just another AI agency')
    expect(screen.getByText(/We don.t sell hype/)).toBeInTheDocument()
  })
})
