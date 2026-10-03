'use client'

import { useState, useTransition } from 'react'
import { createTestimonial, updateTestimonial } from '@/app/actions/testimonials'
import type { Testimonial } from '@/lib/types'

export function TestimonialForm({
  testimonial,
  onSaved,
}: {
  testimonial: Testimonial | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      quote: String(formData.get('quote') ?? ''),
      clientName: String(formData.get('client_name') ?? ''),
      clientRole: (formData.get('client_role') as string) || null,
      avatarUrl: testimonial?.avatarUrl ?? null,
      isPublished: testimonial?.isPublished ?? false,
      sortOrder: testimonial?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, input)
        : await createTestimonial(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <textarea name="quote" placeholder="Quote" defaultValue={testimonial?.quote} required />
      <input
        name="client_name"
        placeholder="Client name"
        defaultValue={testimonial?.clientName}
        required
      />
      <input
        name="client_role"
        placeholder="Client role"
        defaultValue={testimonial?.clientRole ?? ''}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : testimonial ? 'Save' : 'Add testimonial'}
      </button>
      {error && <p data-testid="testimonial-form-error">{error}</p>}
    </form>
  )
}
