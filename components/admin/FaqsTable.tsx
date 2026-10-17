'use client'

import { useTransition } from 'react'
import { deleteFaq } from '@/app/actions/faqs'
import {
  adminCard,
  adminDangerButton,
  adminSecondaryButton,
  adminTable,
  adminTd,
  adminTh,
  EmptyRow,
  StatusPill,
} from '@/components/admin/ui'
import type { Faq } from '@/lib/types'

export function FaqsTable({ faqs, onEdit }: { faqs: Faq[]; onEdit: (faq: Faq) => void }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(faq: Faq) {
    if (!window.confirm(`Delete the FAQ "${faq.question}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteFaq(faq.id)
    })
  }

  return (
    <div className={`${adminCard} overflow-x-auto`}>
      <table className={adminTable}>
        <thead>
          <tr>
            <th className={adminTh}>Question</th>
            <th className={adminTh}>Status</th>
            <th className={adminTh}>Order</th>
            <th className={adminTh}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {faqs.length === 0 && <EmptyRow colSpan={4}>No FAQs yet. Add one above.</EmptyRow>}
          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td className={`${adminTd} font-medium text-[var(--text-primary)]`}>{faq.question}</td>
              <td className={adminTd}>
                {faq.isPublished ? <StatusPill tone="on">Published</StatusPill> : <StatusPill tone="off">Hidden</StatusPill>}
              </td>
              <td className={adminTd}>{faq.sortOrder}</td>
              <td className={`${adminTd} text-right`}>
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(faq)} className={adminSecondaryButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(faq)} disabled={isPending} className={adminDangerButton}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
