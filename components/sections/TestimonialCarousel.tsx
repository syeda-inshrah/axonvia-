'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Testimonial } from '@/lib/types'

const AUTO_ADVANCE_MS = 5000
const SWIPE_THRESHOLD_PX = 50

// 3 cards visible from md up, 1 below (spec §10).
function useCardsPerView() {
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(min-width: 768px)')
    const update = () => setPerView(query.matches ? 3 : 1)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return perView
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const perView = useCardsPerView()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const swipeStartX = useRef<number | null>(null)

  const positions = Math.max(1, items.length - perView + 1)
  const current = Math.min(index, positions - 1)

  function goTo(position: number) {
    setIndex((position + positions) % positions)
  }

  // Restarts on every move, so a manual change always gets a full 5s before the next auto-advance.
  useEffect(() => {
    if (paused || reduced || positions < 2) return
    const timer = setTimeout(() => setIndex((current + 1) % positions), AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [paused, reduced, positions, current])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        data-testid="carousel-viewport"
        className="overflow-hidden touch-pan-y"
        onPointerDown={(event) => {
          swipeStartX.current = event.clientX
        }}
        onPointerUp={(event) => {
          if (swipeStartX.current === null) return
          const distance = event.clientX - swipeStartX.current
          swipeStartX.current = null
          if (distance <= -SWIPE_THRESHOLD_PX) goTo(current + 1)
          else if (distance >= SWIPE_THRESHOLD_PX) goTo(current - 1)
        }}
      >
        <motion.ul
          className="-mx-5 flex"
          animate={{ x: `-${(current * 100) / perView}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {items.map((testimonial, i) => {
            const visible = i >= current && i < current + perView
            return (
              <li
                key={testimonial.id}
                aria-hidden={!visible}
                className="shrink-0 px-5"
                style={{ width: `${100 / perView}%` }}
              >
                <figure className="flex h-full flex-col border-t border-[var(--rule-strong)] pt-6">
                  <blockquote className="text-lg leading-relaxed text-[var(--text-primary)]">
                    <p className="before:content-['“'] after:content-['”']">{testimonial.quote}</p>
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-6">
                    {testimonial.avatarUrl && (
                      // eslint-disable-next-line @next/next/no-img-element -- Plain <img>: CMS avatar URLs can be on any host, which next/image would need configured.
                      <img src={testimonial.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{testimonial.clientName}</p>
                      {testimonial.clientRole && (
                        <p className="text-sm text-[var(--text-muted)]">{testimonial.clientRole}</p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </motion.ul>
      </div>

      {positions > 1 && (
        <div className="mt-10 flex gap-1">
          {Array.from({ length: positions }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => goTo(i)}
              className="p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-[var(--ink-panel)]' : 'w-1.5 bg-[var(--text-muted)]'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
