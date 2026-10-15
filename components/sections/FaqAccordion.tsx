'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Faq } from '@/lib/types'

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="divide-y divide-[var(--border-glass)]">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              className="flex w-full items-center justify-between py-5 text-left text-[var(--text-primary)] font-medium"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.question}
              <Plus className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            {isOpen && <p className="pb-5 text-[var(--text-secondary)]">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
