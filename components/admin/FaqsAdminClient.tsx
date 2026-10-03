'use client'

import { useState } from 'react'
import { FaqForm } from '@/components/admin/FaqForm'
import { FaqsTable } from '@/components/admin/FaqsTable'
import type { Faq } from '@/lib/types'

export function FaqsAdminClient({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<Faq | null>(null)

  return (
    <>
      <FaqForm key={editing?.id ?? 'new'} faq={editing} onSaved={() => setEditing(null)} />
      <FaqsTable faqs={faqs} onEdit={setEditing} />
    </>
  )
}
