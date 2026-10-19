'use client'

import { useTransition } from 'react'
import { updateLeadStatus } from '@/app/actions/leads'
import { adminCard, adminInput, adminTable, adminTd, adminTh, EmptyRow } from '@/components/admin/ui'
import type { Lead } from '@/lib/types'

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [, startTransition] = useTransition()

  function handleStatusChange(id: string, status: Lead['status']) {
    startTransition(async () => {
      await updateLeadStatus(id, status)
    })
  }

  return (
    <div className={`${adminCard} relative overflow-x-auto`}>
      <table className={adminTable}>
        <thead>
          <tr>
            <th className={adminTh}>Contact</th>
            <th className={adminTh}>Message</th>
            <th className={adminTh}>Received</th>
            <th className={adminTh}>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && <EmptyRow colSpan={4}>No messages yet. Contact form submissions appear here.</EmptyRow>}
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className={adminTd}>
                <div className="font-medium text-[var(--text-primary)]">{lead.name}</div>
                <a href={`mailto:${lead.email}`} className="link-underline text-[var(--accent-cyan)]">
                  {lead.email}
                </a>
                {lead.company && <div className="text-xs text-[var(--text-muted)]">{lead.company}</div>}
              </td>
              <td className={`${adminTd} max-w-sm whitespace-pre-line`}>{lead.message || '—'}</td>
              <td className={`${adminTd} whitespace-nowrap`}>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className={adminTd}>
                <select
                  name={`status-${lead.id}`}
                  aria-label={`Status for ${lead.name}`}
                  defaultValue={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                  className={`${adminInput} w-auto`}
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
    </div>
  )
}
