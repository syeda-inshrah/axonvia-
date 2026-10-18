'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { buttonClasses, type ButtonVariant, type ButtonSize } from '@/components/ui/buttonStyles'
import { siteConfig } from '@/lib/site'

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
      cal('ui', { theme: 'light', styles: { branding: { brandColor: '#2563EB' } } })
    })()
  }, [calLink])

  if (!calLink) {
    return (
      <a href={`mailto:${siteConfig.contactEmail}`} data-testid="cal-fallback" className={classes}>
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
