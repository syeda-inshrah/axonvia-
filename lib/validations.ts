import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address'),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
