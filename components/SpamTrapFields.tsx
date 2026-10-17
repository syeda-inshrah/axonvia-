'use client'

import { useEffect, useState } from 'react'
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from '@/lib/spam'

/** Honeypot + start time for the public forms (checked server-side by looksAutomated). */
export function SpamTrapFields() {
  // Set after mount rather than during render, so server and client markup match.
  const [startedAt, setStartedAt] = useState('')
  useEffect(() => setStartedAt(String(Date.now())), [])

  return (
    <>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name={STARTED_AT_FIELD} value={startedAt} />
    </>
  )
}
