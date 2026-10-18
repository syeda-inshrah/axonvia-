'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import type { Faq } from '@/lib/types'

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const baseId = useId()

  return (
    <div className="divide-y divide-[var(--border-glass)]">
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
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-[var(--text-primary)] font-medium"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.question}
              <Plus
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-[var(--text-secondary)]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
