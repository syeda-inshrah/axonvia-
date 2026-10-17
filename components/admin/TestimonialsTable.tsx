'use client'

import { useTransition } from 'react'
import { deleteTestimonial } from '@/app/actions/testimonials'
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
import type { Testimonial } from '@/lib/types'

export function TestimonialsTable({
  testimonials,
  onEdit,
}: {
  testimonials: Testimonial[]
  onEdit: (testimonial: Testimonial) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(testimonial: Testimonial) {
    if (!window.confirm(`Delete the testimonial from ${testimonial.clientName}? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteTestimonial(testimonial.id)
    })
  }

  return (
    <div className={`${adminCard} overflow-x-auto`}>
      <table className={adminTable}>
        <thead>
          <tr>
            <th className={adminTh}>Client</th>
            <th className={adminTh}>Quote</th>
            <th className={adminTh}>Status</th>
            <th className={adminTh}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length === 0 && <EmptyRow colSpan={4}>No testimonials yet.</EmptyRow>}
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id}>
              <td className={`${adminTd} text-[var(--text-primary)]`}>
                <div className="font-medium">{testimonial.clientName}</div>
                {testimonial.clientRole && <div className="text-xs text-[var(--text-muted)]">{testimonial.clientRole}</div>}
              </td>
              <td className={`${adminTd} max-w-xs`}>
                <p className="line-clamp-2">{testimonial.quote}</p>
              </td>
              <td className={adminTd}>
                {testimonial.isPublished ? <StatusPill tone="on">Published</StatusPill> : <StatusPill tone="off">Draft</StatusPill>}
              </td>
              <td className={`${adminTd} text-right`}>
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(testimonial)} className={adminSecondaryButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(testimonial)} disabled={isPending} className={adminDangerButton}>
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
