// app/not-found.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from './not-found'

describe('NotFound', () => {
  it('explains the page is missing and links back home', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    const homeLinks = screen.getAllByRole('link', { name: /Back to home/ })
    expect(homeLinks.length).toBeGreaterThan(0)
    for (const link of homeLinks) expect(link).toHaveAttribute('href', '/')
  })
})
