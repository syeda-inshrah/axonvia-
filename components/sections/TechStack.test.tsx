// components/sections/TechStack.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechStack } from './TechStack'

describe('TechStack', () => {
  it('renders the stack chips, including Neon in place of the unused Supabase', () => {
    render(<TechStack />)

    expect(screen.getByText('Claude API')).toBeInTheDocument()
    expect(screen.getByText('Neon')).toBeInTheDocument()
    expect(screen.queryByText('Supabase')).not.toBeInTheDocument()
    expect(screen.getByText('WhatsApp API')).toBeInTheDocument()
  })
})
