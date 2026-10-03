import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const updateLeadStatus = vi.fn(async () => ({ success: true }))
vi.mock('@/app/actions/leads', () => ({ updateLeadStatus }))

describe('LeadsTable', () => {
  it('calls updateLeadStatus when the status select changes', async () => {
    const { LeadsTable } = await import('./LeadsTable')
    const lead = {
      id: '1',
      name: 'Jane',
      email: 'jane@example.com',
      company: null,
      message: null,
      source: 'contact_form',
      status: 'new' as const,
      createdAt: new Date('2026-10-02T00:00:00Z'),
    }
    render(<LeadsTable leads={[lead]} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'contacted' } })

    await waitFor(() => expect(updateLeadStatus).toHaveBeenCalledWith('1', 'contacted'))
  })
})
