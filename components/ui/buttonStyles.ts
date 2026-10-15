export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'default' | 'large'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[image:var(--accent-gradient)] text-[#05070D] shadow-[0_0_24px_rgba(45,212,255,0.35)] hover:scale-[1.03]',
  secondary:
    'bg-transparent border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]',
  ghost: 'bg-transparent text-[var(--accent-cyan)] hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-7 py-3.5 rounded-xl text-base',
  large: 'px-9 py-[18px] rounded-xl text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'default',
  className = ''
): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
}
