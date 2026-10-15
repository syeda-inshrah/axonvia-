import Link from 'next/link'
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { buttonClasses, type ButtonVariant, type ButtonSize } from './buttonStyles'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function Button({
  variant,
  size,
  children,
  className,
  href,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = buttonClasses(variant, size, className)

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
