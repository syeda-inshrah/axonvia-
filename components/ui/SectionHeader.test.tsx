// components/ui/SectionHeader.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Section, SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('renders the title as the section heading and the supporting line beside it', () => {
    render(<SectionHeader title="AI systems built around your business" subtitle="A subtitle" />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('AI systems built around your business')
    expect(screen.getByText('A subtitle')).toBeInTheDocument()
  })

  it('names its section through the heading id', () => {
    render(
      <Section id="services" labelledBy="services-title">
        <SectionHeader id="services-title" title="What we build" />
      </Section>
    )

    expect(screen.getByRole('region', { name: 'What we build' })).toHaveAttribute('id', 'services')
  })
})
