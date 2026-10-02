import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the placeholder heading', () => {
    render(<HomePage />)
    expect(screen.getByText(/Axonvia/i)).toBeInTheDocument()
  })
})
