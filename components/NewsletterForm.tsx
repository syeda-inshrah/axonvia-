'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await subscribeNewsletter(formData)
      setResult(res)
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {result?.success && <p data-testid="newsletter-success">Subscribed — welcome aboard.</p>}
      {result && !result.success && <p data-testid="newsletter-error">{result.error}</p>}
    </form>
  )
}
