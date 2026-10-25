'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { signInAction } from '@/app/actions/auth'
import { adminInput, adminPrimaryButton, Field, FormError } from '@/components/admin/ui'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // A submit handler rather than a form action: React resets a form after its action runs, which cleared the
  // email after every failed attempt. On success signInAction redirects to /admin; it returns only on failure.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await signInAction(formData)
      setError(result?.error ?? null)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Email">
        {(id) => <input id={id} name="email" type="email" autoComplete="username" required className={adminInput} />}
      </Field>
      <Field label="Password">
        {(id) => (
          <input id={id} name="password" type="password" autoComplete="current-password" required className={adminInput} />
        )}
      </Field>
      <button type="submit" disabled={isPending} className={`${adminPrimaryButton} mt-2 py-2.5`}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <FormError testId="login-error">{error}</FormError>}
    </form>
  )
}
