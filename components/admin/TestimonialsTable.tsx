'use client'

import { useTransition } from 'react'
import { deleteTestimonial } from '@/app/actions/testimonials'
import type { Testimonial } from '@/lib/types'

export function TestimonialsTable({
  testimonials,
  onEdit,
}: {
  testimonials: Testimonial[]
  onEdit: (testimonial: Testimonial) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonial(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Published</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {testimonials.map((testimonial) => (
          <tr key={testimonial.id}>
            <td>{testimonial.clientName}</td>
            <td>{testimonial.isPublished ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(testimonial)}>Edit</button>
              <button onClick={() => handleDelete(testimonial.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
