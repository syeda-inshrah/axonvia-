// app/legal-pages.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrivacyPage from './privacy/page'
import TermsPage from './terms/page'

describe.each([
  ['Privacy Policy', PrivacyPage],
  ['Terms of Service', TermsPage],
])('%s page', (title, Page) => {
  it('is a published document with a date, a way back home and a contact link', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to home/ })).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link', { name: 'axonvia@gmail.com' })[0]).toHaveAttribute(
      'href',
      'mailto:axonvia@gmail.com'
    )
    expect(screen.queryByText(/being finalised/)).not.toBeInTheDocument()
  })
})

describe('Privacy Policy', () => {
  it('names every service that receives visitor data', () => {
    const { container } = render(<PrivacyPage />)
    for (const processor of ['Vercel', 'Neon', 'Resend', 'Google Gemini']) expect(container).toHaveTextContent(processor)
  })

  it('says chat conversations are not stored and no tracking cookies are used', () => {
    const { container } = render(<PrivacyPage />)
    expect(container).toHaveTextContent(/We do not store chat conversations/)
    expect(container).toHaveTextContent(/no analytics or advertising cookies/i)
  })
})
