'use client'

import { useState, useTransition } from 'react'
import { createFaq, updateFaq } from '@/app/actions/faqs'
import type { Faq } from '@/lib/types'

export function FaqForm({ faq, onSaved }: { faq: Faq | null; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      question: String(formData.get('question') ?? ''),
      answer: String(formData.get('answer') ?? ''),
      isPublished: faq?.isPublished ?? true,
      sortOrder: faq?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = faq ? await updateFaq(faq.id, input) : await createFaq(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="question" placeholder="Question" defaultValue={faq?.question} required />
      <textarea name="answer" placeholder="Answer" defaultValue={faq?.answer} required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : faq ? 'Save' : 'Add FAQ'}
      </button>
      {error && <p data-testid="faq-form-error">{error}</p>}
    </form>
  )
}
