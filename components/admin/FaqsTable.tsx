'use client'

import { useTransition } from 'react'
import { deleteFaq } from '@/app/actions/faqs'
import type { Faq } from '@/lib/types'

export function FaqsTable({ faqs, onEdit }: { faqs: Faq[]; onEdit: (faq: Faq) => void }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteFaq(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Question</th>
          <th>Published</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {faqs.map((faq) => (
          <tr key={faq.id}>
            <td>{faq.question}</td>
            <td>{faq.isPublished ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(faq)}>Edit</button>
              <button onClick={() => handleDelete(faq.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
