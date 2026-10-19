export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse'
export type ButtonSize = 'default' | 'large'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--ink-panel)] text-[var(--on-accent)] hover:bg-[var(--accent-cyan)]',
  secondary:
    'bg-transparent border border-[var(--rule-strong)] text-[var(--text-primary)] hover:border-[var(--text-primary)]',
  ghost: 'bg-transparent text-[var(--accent-cyan)] link-underline',
  // For use on the navy panel.
  inverse: 'bg-white text-[var(--text-primary)] hover:bg-[#DCE6FF]',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-5 rounded-lg text-[0.9375rem]',
  large: 'h-[52px] px-6 rounded-lg text-base',
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-colors duration-200 ease-out'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'default',
  className = ''
): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
}
