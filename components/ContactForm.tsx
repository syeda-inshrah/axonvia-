'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { buttonClasses } from '@/components/ui/buttonStyles'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
    })
  }

  const inputClasses =
    'w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none'

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <input name="name" placeholder="Name" required className={inputClasses} />
      <input name="email" type="email" placeholder="Email" required className={inputClasses} />
      <input name="company" placeholder="Company" className={inputClasses} />
      <textarea name="message" placeholder="Message" className={inputClasses} rows={4} />
      <button type="submit" disabled={isPending} className={buttonClasses('primary', 'default', 'w-full')}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      {result?.success && <p data-testid="form-success" className="text-[var(--success)]">Thanks — we&apos;ll be in touch.</p>}
      {result && !result.success && <p data-testid="form-error" className="text-red-400">{result.error}</p>}
    </form>
  )
}
