'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="company" placeholder="Company" />
      <textarea name="message" placeholder="Message" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      {result?.success && <p data-testid="form-success">Thanks — we&apos;ll be in touch.</p>}
      {result && !result.success && <p data-testid="form-error">{result.error}</p>}
    </form>
  )
}
