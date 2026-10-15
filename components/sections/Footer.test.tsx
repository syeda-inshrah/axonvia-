// components/sections/Footer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders all 4 columns and the copyright line', () => {
    render(<Footer />)

    expect(screen.getByRole('heading', { name: 'Navigate' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Axonvia/)).toBeInTheDocument()
  })
})
