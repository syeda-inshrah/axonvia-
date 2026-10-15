import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border border-[var(--border-glass)] px-4 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  )
}
