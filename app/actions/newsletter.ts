'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { newsletterSchema } from '@/lib/validations'
import { sendNewsletterWelcome } from '@/lib/email'
import { headers } from 'next/headers'
import { allowSubmission, looksAutomated } from '@/lib/spam'
import { clientIp } from '@/lib/client-ip'
import { diagnoseDbError } from '@/lib/db/diagnose'
import type { ActionResult } from '@/app/actions/contact'

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { email } = parsed.data

  if (looksAutomated(formData)) return { success: true }
  if (!allowSubmission('newsletter', clientIp(await headers()), email)) {
    return { success: false, error: 'Too many signups. Please try again later.' }
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, status: 'subscribed' })
      .onConflictDoUpdate({ target: newsletterSubscribers.email, set: { status: 'subscribed' } })
  } catch (error) {
    console.error(JSON.stringify({ event: 'subscriber_save_error', ...diagnoseDbError(error) }))
    return { success: false, error: 'Something went wrong subscribing. Please try again.' }
  }

  try {
    await sendNewsletterWelcome(email)
  } catch (emailError) {
    const message = emailError instanceof Error ? emailError.message : String(emailError)
    console.error(JSON.stringify({ event: 'email_send_error', email: 'newsletter_welcome', message }))
  }

  return { success: true }
}
