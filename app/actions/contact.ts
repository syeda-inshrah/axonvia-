'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { contactFormSchema } from '@/lib/validations'
import { sendContactNotification, sendContactConfirmation } from '@/lib/email'
import { headers } from 'next/headers'
import { allowSubmission, looksAutomated } from '@/lib/spam'
import { clientIp } from '@/lib/client-ip'

export interface ActionResult {
  success: boolean
  error?: string
}

export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') ?? '',
    message: formData.get('message') ?? '',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { name, email, company, message } = parsed.data

  // Bots get a normal-looking success so they don't learn they were caught.
  if (looksAutomated(formData)) return { success: true }
  if (!allowSubmission('contact', clientIp(await headers()), email)) {
    return { success: false, error: 'Too many messages. Please try again later.' }
  }

  try {
    await db.insert(leads).values({
      name,
      email,
      company: company || null,
      message: message || null,
    })
  } catch {
    return { success: false, error: 'Something went wrong saving your message. Please try again.' }
  }

  try {
    await Promise.all([
      sendContactNotification({ name, email, company, message }),
      sendContactConfirmation({ name, email, company, message }),
    ])
  } catch (emailError) {
    console.error('Contact form email send failed:', emailError)
  }

  return { success: true }
}
