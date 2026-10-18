import type { ReactNode } from 'react'

export function GlassCard({
  children,
  accent = 'cyan',
  glow = true,
  className = '',
}: {
  children: ReactNode
  accent?: 'cyan' | 'purple'
  glow?: boolean
  className?: string
}) {
  const glowClass = !glow
    ? ''
    : accent === 'cyan'
      ? 'hover:-translate-y-1.5 hover:shadow-[var(--shadow-raised)] hover:border-[var(--border-glow)]'
      : 'hover:-translate-y-1.5 hover:shadow-[var(--shadow-raised)] hover:border-[var(--border-glow-alt)]'

  return (
    <div
      className={`rounded-2xl border border-[var(--border-glass)] bg-[var(--surface)] shadow-[var(--shadow-card)] backdrop-blur-xl p-8 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${glowClass} ${className}`}
    >
      {children}
    </div>
  )
}
