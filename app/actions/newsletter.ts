'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { newsletterSchema } from '@/lib/validations'
import { sendNewsletterWelcome } from '@/lib/email'
import type { ActionResult } from '@/app/actions/contact'

export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { email } = parsed.data

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, status: 'subscribed' })
      .onConflictDoUpdate({ target: newsletterSubscribers.email, set: { status: 'subscribed' } })
  } catch {
    return { success: false, error: 'Something went wrong subscribing. Please try again.' }
  }

  try {
    await sendNewsletterWelcome(email)
  } catch (emailError) {
    console.error('Newsletter welcome email failed:', emailError)
  }

  return { success: true }
}
