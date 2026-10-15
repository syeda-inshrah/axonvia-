export function GradientBlob({
  color = 'cyan',
  className = '',
}: {
  color?: 'cyan' | 'purple'
  className?: string
}) {
  const bg = color === 'cyan' ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--accent-purple)]'

  return (
    <div
      className={`gradient-blob pointer-events-none absolute rounded-full opacity-40 blur-[120px] ${bg} ${className}`}
      aria-hidden="true"
    />
  )
}
