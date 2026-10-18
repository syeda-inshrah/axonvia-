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

  it('gives each status dropdown a unique name so browsers can identify the field', async () => {
    const { LeadsTable } = await import('./LeadsTable')
    const base = { email: 'a@example.com', company: null, message: null, source: 'contact_form', status: 'new' as const, createdAt: new Date() }
    render(<LeadsTable leads={[{ ...base, id: '1', name: 'Jane' }, { ...base, id: '2', name: 'Omar' }]} />)

    expect(screen.getAllByRole('combobox').map((select) => select.getAttribute('name'))).toEqual(['status-1', 'status-2'])
  })
})
