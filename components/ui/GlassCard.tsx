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
      ? 'hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(45,212,255,0.2)] hover:border-[var(--border-glow)]'
      : 'hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(155,92,255,0.2)] hover:border-[rgba(155,92,255,0.35)]'

  return (
    <div
      className={`rounded-2xl border border-[var(--border-glass)] bg-[rgba(15,20,32,0.6)] backdrop-blur-xl p-8 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${glowClass} ${className}`}
    >
      {children}
    </div>
  )
}
