// components/sections/FinalCta.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FinalCta } from './FinalCta'

vi.mock('@/components/CalEmbed', () => ({
  CalEmbed: ({ children }: { children: React.ReactNode }) => <button data-testid="cal-trigger">{children}</button>,
}))

describe('FinalCta', () => {
  it('renders the headline and the booking CTA', () => {
    const { container } = render(<FinalCta />)

    expect(screen.getByRole('heading', { name: /Ready to Put AI to Work in Your Business\?/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Book Your Free Call' })).toBeInTheDocument()
    expect(container.querySelector('button button')).toBeNull()
  })
})
