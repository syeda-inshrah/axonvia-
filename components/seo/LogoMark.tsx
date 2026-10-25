// The brand mark as plain SVG for generated images (share image, Apple touch icon); same artwork as app/icon.svg.
export function LogoMark({ size: px }: { size: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="og-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E5BFF" />
          <stop offset="100%" stopColor="#6A4BEF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#og-logo)" />
      <path d="M10 21.5 L16 10.5 L22 21.5 Z" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="16" cy="10.5" r="2.4" fill="#FFFFFF" />
      <circle cx="10" cy="21.5" r="2.4" fill="#FFFFFF" />
      <circle cx="22" cy="21.5" r="2.4" fill="#FFFFFF" />
    </svg>
  )
}
