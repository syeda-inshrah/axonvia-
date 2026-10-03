'use client'

import { useState } from 'react'
import { TestimonialForm } from '@/components/admin/TestimonialForm'
import { TestimonialsTable } from '@/components/admin/TestimonialsTable'
import type { Testimonial } from '@/lib/types'

export function TestimonialsAdminClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null)

  return (
    <>
      <TestimonialForm
        key={editing?.id ?? 'new'}
        testimonial={editing}
        onSaved={() => setEditing(null)}
      />
      <TestimonialsTable testimonials={testimonials} onEdit={setEditing} />
    </>
  )
}
