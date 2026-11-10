import { Resend } from 'resend'
import { siteConfig } from '@/lib/site'
import { unsubscribeUrl } from '@/lib/unsubscribe'

// Created on first send, not at import: the Resend constructor throws without an API key, which would
// otherwise crash the contact and newsletter actions before a submission could even be saved.
let client: Resend | null = null

function emailClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set; skipping email send.')
    return null
  }
  client ??= new Resend(apiKey)
  return client
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Axonvia <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || siteConfig.contactEmail

export interface LeadEmailPayload {
  name: string
  email: string
  company?: string
  message?: string
  /** False when the lead could not be written to the database, so this email is the only copy. */
  saved?: boolean
}

type EmailMessage = Parameters<Resend['emails']['send']>[0]

// Resend reports a rejected email (unverified domain, bad address, quota) in the result instead of throwing;
// turn that into an error so callers can log it rather than assume it was sent.
async function deliver(resend: Resend, message: EmailMessage) {
  const { data, error } = await resend.emails.send(message)
  if (error) throw new Error(error.message)
  return data
}

export async function sendContactNotification(lead: LeadEmailPayload) {
  const resend = emailClient()
  if (!resend) return null
  return deliver(resend, {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    // Replying to the notification answers the lead directly.
    replyTo: lead.email,
    subject: `${lead.saved === false ? '[Not saved] ' : ''}New lead: ${lead.name}`,
    text:
      (lead.saved === false ? 'This enquiry could NOT be saved to the database, so this email is the only copy.\n\n' : '') +
      `Name: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company ?? '—'}\nMessage: ${lead.message ?? '—'}`,
  })
}

export async function sendContactConfirmation(lead: LeadEmailPayload) {
  const resend = emailClient()
  if (!resend) return null
  return deliver(resend, {
    from: FROM_EMAIL,
    to: lead.email,
    subject: 'We received your message — Axonvia',
    text: `Hi ${lead.name},\n\nThanks for reaching out to Axonvia. We'll get back to you shortly.\n\n— Axonvia`,
  })
}

export async function sendNewsletterWelcome(email: string) {
  const resend = emailClient()
  if (!resend) return null
  const unsubscribe = unsubscribeUrl(email)
  return deliver(resend, {
    from: FROM_EMAIL,
    to: email,
    subject: "You're subscribed — Axonvia",
    text: `Thanks for subscribing to Axonvia updates. We'll keep you posted.\n\nDon't want these emails? Unsubscribe: ${unsubscribe}`,
    headers: { 'List-Unsubscribe': `<${unsubscribe}>` },
  })
}
