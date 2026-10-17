'use client'

import { useEffect, useRef } from 'react'
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from '@/lib/spam'

/** Honeypot + start time for the public forms (checked server-side by looksAutomated). */
export function SpamTrapFields() {
  const startedAt = useRef<HTMLInputElement>(null)

  // Stamped into the DOM after mount (not rendered), so server and client markup match.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [])

  return (
    <>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name={STARTED_AT_FIELD} defaultValue="" />
    </>
  )
}
