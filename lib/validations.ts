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

// CMS input (admin only). Links render as hrefs/img src on the public page, so only http(s) URLs are allowed.
const httpUrl = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const { protocol } = new URL(value)
      return protocol === 'http:' || protocol === 'https:'
    } catch {
      return false
    }
  }, 'Links must be full URLs starting with http:// or https://')

const sortOrder = z.number().int().min(0).max(10_000)

export const projectInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  stats: z.array(z.string().trim().min(1).max(100)).max(8),
  tags: z.array(z.string().trim().min(1).max(50)).max(12),
  imageUrl: httpUrl.nullable(),
  link: httpUrl.nullable(),
  isFeatured: z.boolean(),
  status: z.enum(['live', 'coming_soon']),
  sortOrder,
})

export const testimonialInputSchema = z.object({
  quote: z.string().trim().min(1, 'Quote is required').max(1000),
  clientName: z.string().trim().min(1, 'Client name is required').max(200),
  clientRole: z.string().trim().max(200).nullable(),
  avatarUrl: httpUrl.nullable(),
  isPublished: z.boolean(),
  sortOrder,
})

export const faqInputSchema = z.object({
  question: z.string().trim().min(1, 'Question is required').max(300),
  answer: z.string().trim().min(1, 'Answer is required').max(3000),
  isPublished: z.boolean(),
  sortOrder,
})
