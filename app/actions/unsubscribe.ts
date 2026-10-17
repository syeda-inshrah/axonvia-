'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'
import type { ActionResult } from '@/app/actions/contact'

export async function unsubscribeNewsletter(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const token = String(formData.get('token') ?? '')

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return { success: false, error: 'This unsubscribe link is invalid or has been altered.' }
  }

  try {
    await db.update(newsletterSubscribers).set({ status: 'unsubscribed' }).where(eq(newsletterSubscribers.email, email))
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
