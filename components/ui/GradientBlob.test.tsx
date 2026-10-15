// components/ui/GradientBlob.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GradientBlob } from './GradientBlob'

describe('GradientBlob', () => {
  it('renders as a decorative, hidden element with the cyan accent by default', () => {
    const { container } = render(<GradientBlob />)
    const blob = container.firstChild as HTMLElement

    expect(blob).toHaveAttribute('aria-hidden', 'true')
    expect(blob).toHaveClass('gradient-blob', 'bg-[var(--accent-cyan)]')
  })

  it('applies the purple accent when requested', () => {
    const { container } = render(<GradientBlob color="purple" />)
    expect(container.firstChild).toHaveClass('bg-[var(--accent-purple)]')
  })
})
