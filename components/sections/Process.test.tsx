// components/sections/Process.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Process } from './Process'

describe('Process', () => {
  it('renders all 5 engagement steps', () => {
    render(<Process />)
    expect(screen.getByText('Discovery Call')).toBeInTheDocument()
    expect(screen.getByText('Proposal & Scope')).toBeInTheDocument()
    expect(screen.getByText('Build Sprint')).toBeInTheDocument()
    expect(screen.getByText('Testing & Handoff')).toBeInTheDocument()
    expect(screen.getByText('Support & Iteration')).toBeInTheDocument()
  })
})
