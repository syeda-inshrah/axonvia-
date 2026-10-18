import { useId, type ReactNode } from 'react'

// Shared look for the admin dashboard: same tokens as the public site, denser and calmer.
export const adminInput =
  'w-full rounded-lg border border-[var(--border-glass)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none'
export const adminCard = 'rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)]'
export const adminPrimaryButton =
  'inline-flex items-center justify-center rounded-lg bg-[image:var(--accent-gradient)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] transition-opacity duration-200 hover:opacity-90 disabled:opacity-60'
export const adminSecondaryButton =
  'inline-flex items-center justify-center rounded-lg border border-[var(--border-glass)] px-3 py-1.5 text-sm text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)] disabled:opacity-60'
export const adminDangerButton =
  'inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-sm text-[var(--danger)] transition-colors duration-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-60'
export const adminTable = 'w-full min-w-[560px] text-left text-sm'
export const adminTh = 'px-4 py-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]'
export const adminTd = 'border-t border-[var(--border-glass)] px-4 py-3 align-top text-[var(--text-secondary)]'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-[var(--text-secondary)]">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--accent-cyan)]" />
      {label}
    </label>
  )
}

export function StatusPill({ tone, children }: { tone: 'on' | 'off' | 'warn'; children: ReactNode }) {
  const tones = {
    on: 'border-[var(--success)]/30 bg-[var(--success)]/5 text-[var(--success)]',
    off: 'border-[var(--border-glass)] text-[var(--text-muted)]',
    warn: 'border-[var(--border-glow)] bg-[var(--tint)] text-[var(--accent-cyan)]',
  }
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${tones[tone]}`}>{children}</span>
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className={`${adminTd} py-10 text-center text-[var(--text-muted)]`}>
        {children}
      </td>
    </tr>
  )
}

export function FormError({ testId, children }: { testId: string; children: ReactNode }) {
  return (
    <p role="alert" data-testid={testId} className="text-sm text-[var(--danger)]">
      {children}
    </p>
  )
}

/** Integer from a number input; blank or invalid becomes 0. */
export function toSortOrder(value: FormDataEntryValue | null): number {
  const n = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

/** Optional URL field: blank becomes null. */
export function toOptionalUrl(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? '').trim()
  return s === '' ? null : s
}
