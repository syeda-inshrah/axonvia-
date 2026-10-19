'use client'

import type { PointerEvent, ReactNode } from 'react'

// Card whose light follows the pointer. The position goes straight into CSS variables (no React state), so
// moving the mouse never re-renders anything; globals.css draws the light and the gradient hairline.
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - box.top}px`)
  }

  return (
    <div
      onPointerMove={track}
      className={`spotlight-card rounded-2xl border border-[var(--rule)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  )
}
