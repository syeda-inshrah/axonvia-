// components/ui/Logo.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders a decorative brand mark that screen readers skip (the wordmark beside it carries the name)', () => {
    const { container } = render(<Logo className="h-8 w-8" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('h-8', 'w-8')
  })
})
