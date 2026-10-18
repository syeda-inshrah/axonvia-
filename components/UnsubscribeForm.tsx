'use client'

import { useState, useTransition } from 'react'
import { unsubscribeNewsletter } from '@/app/actions/unsubscribe'
import { buttonClasses } from '@/components/ui/buttonStyles'

export function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  if (result?.success) {
    return (
      <p role="status" className="mt-8 text-[var(--success)]">
        You&apos;re unsubscribed. You won&apos;t receive any more updates from Axonvia.
      </p>
    )
  }

  return (
    <form
      action={(formData) => startTransition(async () => setResult(await unsubscribeNewsletter(formData)))}
      className="mt-8"
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="token" value={token} />
      <button type="submit" disabled={isPending} className={buttonClasses('primary')}>
        {isPending ? 'Unsubscribing…' : 'Unsubscribe'}
      </button>
      {result?.error && (
        <p role="alert" className="mt-4 text-[var(--danger)]">
          {result.error}
        </p>
      )}
    </form>
  )
}
