// components/admin/AdminNav.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/projects' }))
vi.mock('@/app/actions/auth', () => ({ signOutAction: vi.fn() }))

describe('AdminNav', () => {
  it('links every admin section, marks the current one, and offers sign out', async () => {
    const { AdminNav } = await import('./AdminNav')
    render(<AdminNav />)

    for (const name of ['Leads', 'Newsletter', 'Projects', 'Testimonials', 'FAQs']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Leads' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: /View site/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })
})
