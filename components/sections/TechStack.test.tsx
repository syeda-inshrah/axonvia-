// components/sections/TechStack.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechStack } from './TechStack'

describe('TechStack', () => {
  it('lists the stack, including Neon in place of the unused Supabase', () => {
    render(<TechStack />)
    // Only the readable lists (the marquee's loop copy is aria-hidden, so role queries skip it).
    const tools = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(tools).toHaveLength(14)
    for (const tool of ['Claude API', 'Neon', 'WhatsApp API']) expect(tools.some((text) => text?.startsWith(tool))).toBe(true)
    expect(tools.some((text) => text?.includes('Supabase'))).toBe(false)
  })

  it('labels each tool with the layer of a system it belongs to', () => {
    render(<TechStack />)
    expect(screen.getAllByRole('listitem').find((item) => item.textContent?.startsWith('Neon'))).toHaveTextContent('NeonData')
  })

  it('reads each tool once: the copy that makes the marquee loop is hidden from assistive tech', () => {
    const { container } = render(<TechStack />)
    const hidden = container.querySelectorAll('ul[aria-hidden="true"]')
    expect(hidden).toHaveLength(2)
    expect(screen.getAllByRole('list')).toHaveLength(2)
  })

  it('renders tool names in their real casing, without uppercase label styling', () => {
    render(<TechStack />)
    const tool = screen.getAllByText('Claude API')[0]
    expect(tool).not.toHaveClass('uppercase')
    expect(tool).not.toHaveClass('text-xs')
  })
})
