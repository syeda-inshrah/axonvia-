'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'

/**
 * The project showcase's 3D stage. As it scrolls into view the framed screenshot swings up from lying back
 * (rotateX) to face the reader, while the floating labels around it drift at their own speeds for depth
 * (ScrollTrigger scrub). Reduced-motion visitors see it flat and still.
 */
export function ShowcaseStage({ children, labels }: { children: ReactNode; labels: string[] }) {
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.fromTo(
          '[data-stage-frame]',
          { rotationX: 26, scale: 0.86, y: 40, transformOrigin: '50% 100%' },
          {
            rotationX: 0,
            scale: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: stage.current, start: 'top 95%', end: 'center 55%', scrub: 0.8 },
          }
        )
        gsap.utils.toArray<HTMLElement>('[data-stage-label]').forEach((label, i) => {
          gsap.fromTo(
            label,
            { yPercent: 120 + i * 60 },
            {
              yPercent: -(80 + i * 50),
              ease: 'none',
              scrollTrigger: { trigger: stage.current, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        })
      }),
    { scope: stage }
  )

  const positions = ['-left-4 top-[18%] md:-left-10', '-right-3 top-[8%] md:-right-12', '-right-2 bottom-[16%] md:-right-8', '-left-2 bottom-[6%] md:-left-6']

  return (
    <div ref={stage} className="relative [perspective:1800px]">
      <div data-stage-frame style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {labels.slice(0, positions.length).map((label, i) => (
        <span
          key={label}
          aria-hidden="true"
          data-stage-label
          className={`absolute ${positions[i]} hidden rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-raised)] backdrop-blur-md sm:block`}
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[image:var(--accent-gradient)] align-middle" />
          {label}
        </span>
      ))}
    </div>
  )
}
