'use client'

import { useTransition } from 'react'
import { updateLeadStatus } from '@/app/actions/leads'
import type { Lead } from '@/lib/types'

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [, startTransition] = useTransition()

  function handleStatusChange(id: string, status: Lead['status']) {
    startTransition(async () => {
      await updateLeadStatus(id, status)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.company ?? '—'}</td>
            <td>
              <select
                defaultValue={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
