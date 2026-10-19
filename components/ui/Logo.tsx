// Placeholder brand mark (three linked nodes) until the real Axonvia logo is supplied.
// app/icon.svg carries the same mark as the favicon.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" fill="#0B1B3F" />
      <path d="M10 21.5 L16 10.5 L22 21.5 Z" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="16" cy="10.5" r="2.4" fill="#FFFFFF" />
      <circle cx="10" cy="21.5" r="2.4" fill="#FFFFFF" />
      <circle cx="22" cy="21.5" r="2.4" fill="#5B8CFF" />
    </svg>
  )
}
