'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { SpamTrapFields } from '@/components/SpamTrapFields'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  // A submit handler rather than a form action: React resets a form after its action runs, which would wipe
  // what the visitor typed whenever sending fails. The fields are cleared only after a successful send.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
      if (res.success) form.reset()
    })
  }

  const inputClasses =
    'w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
      <SpamTrapFields />
      <input name="name" aria-label="Name" autoComplete="name" placeholder="Name" required maxLength={200} className={inputClasses} />
      <input name="email" type="email" aria-label="Email" autoComplete="email" placeholder="Email" required className={inputClasses} />
      <input name="company" aria-label="Company" autoComplete="organization" placeholder="Company" maxLength={200} className={inputClasses} />
      <input
        name="automate"
        aria-label="What would you like to automate?"
        placeholder="What would you like to automate?"
        maxLength={300}
        className={inputClasses}
      />
      <textarea name="message" aria-label="Message" placeholder="Message" maxLength={2000} className={inputClasses} rows={4} />
      <button type="submit" disabled={isPending} className={buttonClasses('primary', 'default', 'w-full')}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      <div aria-live="polite">
        {result?.success && (
          <p data-testid="form-success" className="text-[var(--success)]">
            Thanks — we&apos;ll be in touch to arrange your free audit.
          </p>
        )}
        {result && !result.success && (
          <p data-testid="form-error" role="alert" className="text-[var(--danger)]">
            {result.error}
          </p>
        )}
      </div>
    </form>
  )
}
