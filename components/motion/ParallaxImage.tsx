'use client'

import { useRef } from 'react'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

type ImgProps = { src: string; alt: string; width?: number; height?: number; className?: string }

/**
 * A screenshot that drifts a few percent inside its frame as the page scrolls past, tied to the scrollbar.
 * Held still for reduced-motion visitors.
 */
export function ParallaxImage({ src, alt, width, height, className = '' }: ImgProps) {
  const frame = useRef<HTMLDivElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.fromTo(
          'img',
          { yPercent: -3, scale: 1.08 },
          {
            yPercent: 3,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      }),
    { scope: frame }
  )

  return (
    <div ref={frame} className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host, which next/image would need configured. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`block h-auto w-full ${className}`}
      />
    </div>
  )
}
