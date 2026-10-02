import { describe, it, expect } from 'vitest'
import { contactFormSchema, newsletterSchema } from './validations'

describe('contactFormSchema', () => {
  it('accepts a valid submission', () => {
    const result = contactFormSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Acme',
      message: 'Tell me more',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = contactFormSchema.safeParse({ name: '', email: 'jane@example.com' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = contactFormSchema.safeParse({ name: 'Jane', email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  it('accepts a valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'jane@example.com' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'nope' }).success).toBe(false)
  })
})
