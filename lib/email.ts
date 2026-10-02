import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Axonvia <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? 'hello@axonvia.example'

export interface LeadEmailPayload {
  name: string
  email: string
  company?: string
  message?: string
}

export async function sendContactNotification(lead: LeadEmailPayload) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New lead: ${lead.name}`,
    text: `Name: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company ?? '—'}\nMessage: ${lead.message ?? '—'}`,
  })
}

export async function sendContactConfirmation(lead: LeadEmailPayload) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: lead.email,
    subject: 'We received your message — Axonvia',
    text: `Hi ${lead.name},\n\nThanks for reaching out to Axonvia. We'll get back to you shortly.\n\n— Axonvia`,
  })
}

export async function sendNewsletterWelcome(email: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You're subscribed — Axonvia",
    text: `Thanks for subscribing to Axonvia updates. We'll keep you posted.`,
  })
}
