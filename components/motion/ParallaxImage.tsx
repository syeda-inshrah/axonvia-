'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type ImgProps = { src: string; alt: string; width?: number; height?: number; className?: string }

/**
 * A screenshot that drifts a few percent inside its frame as the page scrolls past, and eases in slightly on
 * hover of the surrounding `group`. Held still for reduced-motion visitors.
 */
export function ParallaxImage({ src, alt, width, height, className = '' }: ImgProps) {
  const frame = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  return (
    <div ref={frame} className="overflow-hidden">
      <m.div data-parallax={!reduced} style={reduced ? undefined : { y, scale: 1.08 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host, which next/image would need configured. */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.03] ${className}`}
        />
      </m.div>
    </div>
  )
}
