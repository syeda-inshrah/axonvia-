import type { ReactNode } from 'react'
import { BOOKING_URL } from '@/lib/site'
import { buttonClasses, type ButtonVariant, type ButtonSize } from './buttonStyles'

/**
 * Every "Book a Free Automation Audit" button. BOOKING_URL (lib/site.ts) decides where it goes: an in-page anchor
 * scrolls to the contact form; an external booking link (e.g. Cal.com) opens in a new tab.
 */
export function BookingButton({
  children = 'Book a Free Automation Audit',
  variant,
  size,
  className,
  onClick,
}: {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  onClick?: () => void
}) {
  const external = /^https?:\/\//.test(BOOKING_URL)
  return (
    <a
      href={BOOKING_URL}
      data-booking
      onClick={onClick}
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
