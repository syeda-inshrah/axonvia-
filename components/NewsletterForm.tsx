'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { SpamTrapFields } from '@/components/SpamTrapFields'

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
    <form action={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
      <SpamTrapFields />
      <input
        name="email"
        type="email"
        aria-label="Email address"
        autoComplete="email"
        placeholder="Email"
        required
        className="min-w-0 flex-1 rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none"
      />
      <button type="submit" disabled={isPending} className={buttonClasses('primary')}>
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {result?.success && <p data-testid="newsletter-success" className="text-[var(--success)]">Subscribed — welcome aboard.</p>}
      {result && !result.success && <p data-testid="newsletter-error" className="text-[var(--danger)]">{result.error}</p>}
    </form>
  )
}
