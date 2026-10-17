'use client'

import { useState, useTransition } from 'react'
import { createFaq, updateFaq } from '@/app/actions/faqs'
import {
  adminCard,
  adminInput,
  adminPrimaryButton,
  adminSecondaryButton,
  Checkbox,
  Field,
  FormError,
  toSortOrder,
} from '@/components/admin/ui'
import type { Faq } from '@/lib/types'

export function FaqForm({ faq, onSaved, onCancel }: { faq: Faq | null; onSaved: () => void; onCancel?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      question: String(formData.get('question') ?? ''),
      answer: String(formData.get('answer') ?? ''),
      isPublished: formData.get('isPublished') === 'on',
      sortOrder: toSortOrder(formData.get('sortOrder')),
    }

    startTransition(async () => {
      const result = faq ? await updateFaq(faq.id, input) : await createFaq(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit} className={`${adminCard} mb-8 flex flex-col gap-4 p-6`}>
      <h2 className="font-semibold text-[var(--text-primary)]">{faq ? 'Edit FAQ' : 'Add an FAQ'}</h2>

      <Field label="Question">
        {(id) => <input id={id} name="question" placeholder="Question" defaultValue={faq?.question} required className={adminInput} />}
      </Field>
      <Field label="Answer">
        {(id) => <textarea id={id} name="answer" placeholder="Answer" defaultValue={faq?.answer} required rows={4} className={adminInput} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort order" hint="Lower numbers show first.">
          {(id) => <input id={id} name="sortOrder" type="number" min={0} defaultValue={faq?.sortOrder ?? 0} className={adminInput} />}
        </Field>
      </div>

      <Checkbox name="isPublished" label="Published on the site" defaultChecked={faq?.isPublished ?? true} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className={adminPrimaryButton}>
          {isPending ? 'Saving…' : faq ? 'Save' : 'Add FAQ'}
        </button>
        {faq && onCancel && (
          <button type="button" onClick={onCancel} className={adminSecondaryButton}>
            Cancel
          </button>
        )}
      </div>
      {error && <FormError testId="faq-form-error">{error}</FormError>}
    </form>
  )
}
