'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { buttonClasses, type ButtonVariant, type ButtonSize } from '@/components/ui/buttonStyles'

export function CalEmbed({
  children,
  variant,
  size,
  className,
}: {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  const classes = buttonClasses(variant, size, className)
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK

  useEffect(() => {
    if (!calLink) return

    ;(async () => {
      const cal = await getCalApi()
      cal('ui', { theme: 'dark', styles: { branding: { brandColor: '#2DD4FF' } } })
    })()
  }, [calLink])

  if (!calLink) {
    return (
      <a href="mailto:hello@axonvia.example" data-testid="cal-fallback" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button data-cal-link={calLink} data-testid="cal-trigger" className={classes}>
      {children}
    </button>
  )
}
