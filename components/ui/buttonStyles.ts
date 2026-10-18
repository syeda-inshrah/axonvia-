export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'default' | 'large'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[image:var(--accent-gradient)] text-[var(--on-accent)] shadow-[0_8px_24px_-8px_var(--glow)] hover:scale-[1.03] hover:shadow-[0_14px_32px_-10px_var(--glow)]',
  secondary:
    'bg-transparent border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--border-glow)] hover:text-[var(--accent-cyan)]',
  ghost: 'bg-transparent text-[var(--accent-cyan)] link-underline',
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
