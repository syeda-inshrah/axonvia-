'use client'

import { useId, useState, useTransition, type FormEvent, type ReactNode } from 'react'
import { m } from 'motion/react'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { signInAction } from '@/app/actions/auth'

// Dark glass inputs for the login screen: readable white text, a hairline that turns cyan on focus with a soft glow.
const inputClasses =
  'peer w-full rounded-xl border border-white/12 bg-white/[0.06] py-3 pl-11 pr-4 text-[0.9375rem] text-white placeholder:text-[#8E9BBF] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[border-color,box-shadow,background-color] duration-200 hover:border-white/20 focus:border-[#5EE6FF]/70 focus:bg-white/[0.09] focus:shadow-[0_0_0_4px_rgba(94,230,255,0.14)] focus:outline-none'

// Each row rises in after the card (LoginScreen staggers them); reduced motion keeps only the fade.
export const loginRow = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } }

function GlassField({ label, icon, children }: { label: string; icon: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId()
  return (
    <m.div variants={loginRow} className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#D6DDF2]">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8E9BBF]">
          {icon}
        </span>
        {children(id)}
      </div>
    </m.div>
  )
}

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <GlassField label="Email" icon={<Mail className="h-4 w-4" />}>
        {(id) => (
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="you@company.com"
            className={inputClasses}
          />
        )}
      </GlassField>

      <GlassField label="Password" icon={<Lock className="h-4 w-4" />}>
        {(id) => (
          <>
            <input
              id={id}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className={`${inputClasses} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              aria-controls={id}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#AEB9D8] transition-colors hover:bg-white/10 hover:text-white"
            >
              {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
            </button>
          </>
        )}
      </GlassField>

      <m.div variants={loginRow} className="mt-2">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#22D3EE_0%,#2D5BFF_55%,#6A3FF0_100%)] px-4 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(45,91,255,0.75),0_0_0_1px_rgba(255,255,255,0.12)_inset] transition-[box-shadow,transform,opacity] duration-200 hover:shadow-[0_14px_40px_-6px_rgba(34,211,238,0.6),0_0_0_1px_rgba(255,255,255,0.18)_inset] active:scale-[0.99] disabled:cursor-wait disabled:opacity-80 motion-reduce:transition-none"
        >
          {/* A soft sheen sweeps across on hover. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-[left,opacity] duration-700 group-hover:left-[110%] group-hover:opacity-100 motion-reduce:hidden"
          />
          {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
          <span className="relative">{isPending ? 'Signing in…' : 'Sign in'}</span>
        </button>
      </m.div>

      {/* Always present so screen readers announce errors; collapses its row gap while empty. */}
      <div aria-live="polite" className="empty:-mt-5">
        {error && (
          <p
            role="alert"
            data-testid="login-error"
            className="rounded-xl border border-[#FF8A9B]/30 bg-[#FF5C7A]/10 px-4 py-3 text-sm text-[#FFC2CC]"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
