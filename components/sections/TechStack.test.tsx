// components/sections/TechStack.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechStack } from './TechStack'

describe('TechStack', () => {
  it('lists the stack, including Neon in place of the unused Supabase', () => {
    render(<TechStack />)
    expect(screen.getByText('Claude API')).toBeInTheDocument()
    expect(screen.getByText('Neon')).toBeInTheDocument()
    expect(screen.queryByText('Supabase')).not.toBeInTheDocument()
    expect(screen.getByText('WhatsApp API')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(14)
  })

  it('groups each tool under the layer of the system it belongs to', () => {
    render(<TechStack />)
    const data = screen.getByRole('heading', { name: 'Data' }).parentElement!
    expect(within(data).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['PostgreSQL', 'Neon'])
  })

  it('renders tool names in their real casing, without uppercase label styling', () => {
    render(<TechStack />)
    const tool = screen.getByText('Claude API')
    expect(tool).not.toHaveClass('uppercase')
    expect(tool).not.toHaveClass('text-xs')
  })
})
