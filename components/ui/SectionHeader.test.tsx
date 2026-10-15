// components/ui/SectionHeader.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('renders the eyebrow, title, and subtitle', () => {
    render(<SectionHeader eyebrow="What We Do" title="AI Systems Built Around Your Business" subtitle="A subtitle" />)

    expect(screen.getByText('What We Do')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('AI Systems Built Around Your Business')
    expect(screen.getByText('A subtitle')).toBeInTheDocument()
  })

  it('renders the highlighted phrase inside its own span', () => {
    render(<SectionHeader eyebrow="e" title="We Build AI Agents That Run Your Business" highlight="AI Agents" />)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.querySelector('span')).toHaveTextContent('AI Agents')
  })
})
