// components/sections/HowItWorks.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders the agentic explainer and the 4-step timeline', () => {
    render(<HowItWorks />)

    expect(screen.getByText(/What Makes It/)).toBeInTheDocument()
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Build & Test')).toBeInTheDocument()
    expect(screen.getByText('Deploy & Optimize')).toBeInTheDocument()
  })
})
