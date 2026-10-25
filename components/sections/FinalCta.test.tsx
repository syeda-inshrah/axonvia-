// components/sections/FinalCta.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FinalCta } from './FinalCta'

vi.mock('@/app/actions/contact', () => ({ submitContactForm: vi.fn() }))

describe('FinalCta', () => {
  it('renders the headline and the audit invitation, with the form as the booking route for now', () => {
    const { container } = render(<FinalCta />)

    expect(screen.getByRole('heading', { name: /Ready to put AI to work in your business\?/ })).toBeInTheDocument()
    expect(screen.getByText(/Book a free automation audit\. We.ll show you exactly what to automate first\./)).toBeInTheDocument()
    // BOOKING_URL points here, so no button links to this same section.
    expect(container.querySelector('a[data-booking]')).toBeNull()
    expect(container.querySelector('#final-cta')).not.toBeNull()
  })

  it('offers the contact form for visitors who would rather write than book', () => {
    render(<FinalCta />)
    expect(screen.getByRole('heading', { name: 'Send us a message' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('What would you like to automate?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })
})
