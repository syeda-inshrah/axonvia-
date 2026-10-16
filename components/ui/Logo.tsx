import { useId } from 'react'

// Placeholder brand mark (three linked nodes in a ring) until the real Axonvia logo is supplied.
// app/icon.svg carries the same mark as the favicon.
export function Logo({ className = '' }: { className?: string }) {
  const gradientId = `${useId()}-logo-gradient`

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`drop-shadow-[0_0_8px_rgba(45,212,255,0.45)] ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4FF" />
          <stop offset="100%" stopColor="#9B5CFF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill="#0A0E1A" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path d="M10 21 L16 10 L22 21 Z" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="10" r="2.4" fill="#2DD4FF" />
      <circle cx="10" cy="21" r="2.4" fill="#2DD4FF" />
      <circle cx="22" cy="21" r="2.4" fill="#9B5CFF" />
    </svg>
  )
}
