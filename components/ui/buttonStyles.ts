export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline-ink'
export type ButtonSize = 'default' | 'large'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[image:var(--accent-gradient)] text-[var(--on-accent)] shadow-[0_8px_24px_-10px_var(--glow)] hover:shadow-[0_14px_32px_-10px_rgba(46,91,255,0.55)] hover:brightness-110',
  secondary:
    'bg-[var(--bg-card)] border border-[var(--rule-strong)] text-[var(--text-primary)] hover:border-[var(--text-primary)]',
  ghost: 'bg-transparent text-[var(--accent-cyan)] link-underline',
  // For use on navy surfaces.
  inverse: 'bg-white text-[var(--text-primary)] hover:bg-[#E3E9FF]',
  'outline-ink': 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-5 rounded-xl text-[0.9375rem]',
  large: 'h-[52px] px-6 rounded-xl text-base',
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-[background-color,border-color,box-shadow,filter] duration-300 ease-out'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'default',
  className = ''
): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
}
