'use client'

import { useState, useTransition } from 'react'
import { createTestimonial, updateTestimonial } from '@/app/actions/testimonials'
import {
  adminCard,
  adminInput,
  adminPrimaryButton,
  adminSecondaryButton,
  Checkbox,
  Field,
  FormError,
  toOptionalUrl,
  toSortOrder,
} from '@/components/admin/ui'
import type { Testimonial } from '@/lib/types'

export function TestimonialForm({
  testimonial,
  onSaved,
  onCancel,
}: {
  testimonial: Testimonial | null
  onSaved: () => void
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      quote: String(formData.get('quote') ?? ''),
      clientName: String(formData.get('client_name') ?? ''),
      clientRole: (formData.get('client_role') as string) || null,
      avatarUrl: toOptionalUrl(formData.get('avatarUrl')),
      isPublished: formData.get('isPublished') === 'on',
      sortOrder: toSortOrder(formData.get('sortOrder')),
    }

    startTransition(async () => {
      const result = testimonial ? await updateTestimonial(testimonial.id, input) : await createTestimonial(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit} className={`${adminCard} mb-8 flex flex-col gap-4 p-6`}>
      <h2 className="font-semibold text-[var(--text-primary)]">
        {testimonial ? `Edit ${testimonial.clientName}'s testimonial` : 'Add a testimonial'}
      </h2>
      <p className="-mt-2 text-xs text-[var(--text-muted)]">
        Only publish testimonials you have the client&apos;s permission to share.
      </p>

      <Field label="Quote">
        {(id) => <textarea id={id} name="quote" placeholder="Quote" defaultValue={testimonial?.quote} required rows={3} className={adminInput} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name">
          {(id) => (
            <input id={id} name="client_name" placeholder="Client name" defaultValue={testimonial?.clientName} required className={adminInput} />
          )}
        </Field>
        <Field label="Client role">
          {(id) => (
            <input id={id} name="client_role" placeholder="Client role" defaultValue={testimonial?.clientRole ?? ''} className={adminInput} />
          )}
        </Field>
        <Field label="Avatar URL" hint="Optional. Full https:// URL.">
          {(id) => <input id={id} name="avatarUrl" type="url" placeholder="https://" defaultValue={testimonial?.avatarUrl ?? ''} className={adminInput} />}
        </Field>
        <Field label="Sort order" hint="Lower numbers show first.">
          {(id) => <input id={id} name="sortOrder" type="number" min={0} defaultValue={testimonial?.sortOrder ?? 0} className={adminInput} />}
        </Field>
      </div>

      <Checkbox name="isPublished" label="Published on the site" defaultChecked={testimonial?.isPublished} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className={adminPrimaryButton}>
          {isPending ? 'Saving…' : testimonial ? 'Save' : 'Add testimonial'}
        </button>
        {testimonial && onCancel && (
          <button type="button" onClick={onCancel} className={adminSecondaryButton}>
            Cancel
          </button>
        )}
      </div>
      {error && <FormError testId="testimonial-form-error">{error}</FormError>}
    </form>
  )
}
