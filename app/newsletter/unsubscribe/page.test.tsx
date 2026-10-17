// app/newsletter/unsubscribe/page.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import UnsubscribePage from './page'

vi.mock('@/app/actions/unsubscribe', () => ({ unsubscribeNewsletter: vi.fn() }))

describe('UnsubscribePage', () => {
  it('asks for confirmation (a button, not an automatic action) so email link scanners cannot unsubscribe people', async () => {
    render(await UnsubscribePage({ searchParams: Promise.resolve({ email: 'jane@example.com', token: 'abc' }) }))
    expect(screen.getByRole('heading', { level: 1, name: 'Unsubscribe from Axonvia updates' })).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeInTheDocument()
  })

  it('explains when the link is incomplete', async () => {
    render(await UnsubscribePage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByText(/This unsubscribe link is incomplete/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument()
  })
})
