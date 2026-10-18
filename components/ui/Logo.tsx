import { useId } from 'react'

// Placeholder brand mark (three linked nodes in a ring) until the real Axonvia logo is supplied.
// app/icon.svg carries the same mark as the favicon.
export function Logo({ className = '' }: { className?: string }) {
  const gradientId = `${useId()}-logo-gradient`

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`drop-shadow-[0_2px_6px_rgba(37,99,235,0.25)] ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill="#EFF6FF" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path d="M10 21 L16 10 L22 21 Z" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="10" r="2.4" fill="#2563EB" />
      <circle cx="10" cy="21" r="2.4" fill="#2563EB" />
      <circle cx="22" cy="21" r="2.4" fill="#1E3A8A" />
    </svg>
  )
}
