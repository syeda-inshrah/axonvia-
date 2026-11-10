'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { contactFormSchema } from '@/lib/validations'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'
import { headers } from 'next/headers'
import { allowSubmission, looksAutomated } from '@/lib/spam'
import { clientIp } from '@/lib/client-ip'
import { diagnoseDbError } from '@/lib/db/diagnose'

export interface ActionResult {
  success: boolean
  error?: string
}

export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') ?? '',
    automate: formData.get('automate') ?? '',
    message: formData.get('message') ?? '',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { name, email, company, automate } = parsed.data
  // "What would you like to automate?" is stored at the top of the message, so no database change is needed.
  const message = [automate && `What they'd like to automate: ${automate}`, parsed.data.message].filter(Boolean).join('\n\n')

  // Bots get a normal-looking success so they don't learn they were caught.
  if (looksAutomated(formData)) return { success: true }
  if (!allowSubmission('contact', clientIp(await headers()), email)) {
    return { success: false, error: 'Too many messages. Please try again later.' }
  }

  let saved = true
  let saveFailure: ReturnType<typeof diagnoseDbError> | undefined
  try {
    await db.insert(leads).values({
      name,
      email,
      company: company || null,
      message: message || null,
    })
  } catch (error) {
    saved = false
    saveFailure = diagnoseDbError(error)
  }

  // The team notification doubles as the backup copy when the save failed. Each email is settled separately so one
  // failing (e.g. an unverified sender) never stops the other, and every failure is logged as one JSON line.
  const lead = { name, email, company, message, saved }
  const [notification, confirmation] = await Promise.allSettled([
    sendContactNotification(lead),
    sendContactConfirmation(lead),
  ])
  const emailedInstead = notification.status === 'fulfilled' && notification.value != null

  if (saveFailure) {
    console.error(JSON.stringify({ event: 'lead_save_error', ...saveFailure, emailedInstead }))
  }
  for (const [kind, result] of [['contact_notification', notification], ['contact_confirmation', confirmation]] as const) {
    if (result.status === 'rejected') {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
      console.error(JSON.stringify({ event: 'email_send_error', email: kind, message: reason }))
    }
  }

  if (!saved && !emailedInstead) {
    return { success: false, error: 'Something went wrong saving your message. Please try again.' }
  }
  return { success: true }
}
