// components/sections/Process.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Process } from './Process'

describe('Process', () => {
  it('renders all 5 engagement steps, in order', () => {
    render(<Process />)
    const steps = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(steps).toEqual(['Discovery Call', 'Proposal & Scope', 'Build Sprint', 'Testing & Handoff', 'Support & Iteration'])
  })

  it('is the target of the "How it works" navigation link', () => {
    render(<Process />)
    expect(screen.getByRole('region', { name: 'From first call to live system' })).toHaveAttribute('id', 'how-it-works')
  })

  it('shows the line drawn and every step filled when no scroll animation runs', () => {
    const { container } = render(<Process />)
    expect(container.querySelector('[data-process-line]')).not.toHaveAttribute('style')
    for (const marker of container.querySelectorAll('[data-step-marker]')) {
      expect(marker).toHaveClass('bg-[var(--ink-panel)]')
    }
  })
})
