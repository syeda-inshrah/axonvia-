'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'

export function CalEmbed({ children }: { children: React.ReactNode }) {
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
      <a href="mailto:hello@axonvia.example" data-testid="cal-fallback">
        {children}
      </a>
    )
  }

  return (
    <button data-cal-link={calLink} data-testid="cal-trigger">
      {children}
    </button>
  )
}
