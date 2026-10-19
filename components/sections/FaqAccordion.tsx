'use client'

import { useId, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { gsap, useGSAP, withMotion } from '@/lib/gsap'
import type { Faq } from '@/lib/types'

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The open answer grows from nothing when it mounts; reduced-motion visitors see it appear at once.
function AnswerPanel({ id, labelledBy, children }: { id: string; labelledBy: string; children: string }) {
  const panel = useRef<HTMLDivElement>(null)

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from(panel.current, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'height,opacity' })
      }),
    { scope: panel }
  )

  return (
    <div ref={panel} id={id} role="region" aria-labelledby={labelledBy} className="overflow-hidden">
      <p className="max-w-[40rem] pb-6 text-[var(--text-secondary)]">{children}</p>
    </div>
  )
}

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const baseId = useId()
  const root = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: root })

  // Closing collapses the answer first, then removes it; opening mounts it and AnswerPanel grows it in.
  const toggle = contextSafe((id: string, panelId: string) => {
    if (openId !== id) return setOpenId(id)
    const panel = document.getElementById(panelId)
    if (!panel || prefersReducedMotion()) return setOpenId(null)
    gsap.to(panel, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => setOpenId(null) })
  })

  return (
    <div
      ref={root}
      className="divide-y divide-[var(--rule)] rounded-2xl border border-[var(--rule)] bg-[var(--bg-card)] px-6 shadow-[var(--shadow-card)]"
    >
      {items.map((item) => {
        const isOpen = openId === item.id
        const triggerId = `${baseId}-trigger-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`
        return (
          <div key={item.id}>
            <button
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg text-[var(--text-primary)] font-medium hover:text-[var(--accent-cyan)] transition-colors"
              onClick={() => toggle(item.id, panelId)}
            >
              {item.question}
              <Plus
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              />
            </button>
            {isOpen && (
              <AnswerPanel id={panelId} labelledBy={triggerId}>
                {item.answer}
              </AnswerPanel>
            )}
          </div>
        )
      })}
    </div>
  )
}
