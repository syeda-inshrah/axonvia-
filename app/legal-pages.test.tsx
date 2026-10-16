// app/legal-pages.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrivacyPage from './privacy/page'
import TermsPage from './terms/page'

describe.each([
  ['Privacy Policy', PrivacyPage],
  ['Terms of Service', TermsPage],
])('%s page', (title, Page) => {
  it('shows a branded holding page with a way back home and a contact link, without inventing legal terms', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to home/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'hello@axonvia.example' })).toHaveAttribute(
      'href',
      'mailto:hello@axonvia.example'
    )
    expect(screen.getByText(/being finalised/)).toBeInTheDocument()
  })
})
