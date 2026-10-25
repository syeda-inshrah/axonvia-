// components/sections/TechStack.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechStack } from './TechStack'

describe('TechStack', () => {
  it('lists the stack once, in a single list, with no duplicated scrolling rows', () => {
    render(<TechStack />)
    expect(screen.getAllByRole('list')).toHaveLength(1)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Claude API', 'OpenAI', 'n8n', 'Make', 'LangChain', 'Python', 'Next.js', 'React', 'Node.js', 'FastAPI', 'PostgreSQL', 'WhatsApp API', 'REST & Webhooks',
    ])
  })
})
