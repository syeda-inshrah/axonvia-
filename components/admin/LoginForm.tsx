'use client'

import { useState, useTransition } from 'react'
import { signInAction } from '@/app/actions/auth'
import { adminInput, adminPrimaryButton, Field, FormError } from '@/components/admin/ui'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          // On success signInAction redirects to /admin; it only returns when sign-in failed.
          const result = await signInAction(formData)
          setError(result?.error ?? null)
        })
      }
      className="flex flex-col gap-4"
    >
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
