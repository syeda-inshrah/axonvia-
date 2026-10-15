// components/sections/Services.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders the section header and all 6 service cards', () => {
    render(<Services />)

    expect(screen.getByRole('heading', { name: 'AI Systems Built Around Your Business' })).toBeInTheDocument()
    expect(screen.getByText('AI Agent Development')).toBeInTheDocument()
    expect(screen.getByText('Workflow Automation')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered Products')).toBeInTheDocument()
    expect(screen.getByText('Conversational AI & Chatbots')).toBeInTheDocument()
    expect(screen.getByText('Data & Integration')).toBeInTheDocument()
    expect(screen.getByText('AI Strategy & Consulting')).toBeInTheDocument()
  })
})
