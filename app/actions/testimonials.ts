'use server'

import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminUser } from '@/lib/require-admin'
import { testimonialInputSchema } from '@/lib/validations'
import type { ActionResult } from '@/app/actions/contact'
import type { Testimonial } from '@/lib/types'

// Refresh the admin list and the public homepage that renders this content.
function refresh() {
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
}

function invalid(error: { issues: { message: string }[] }): ActionResult {
  return { success: false, error: error.issues[0]?.message ?? 'Invalid input' }
}

export async function listTestimonialsForAdmin(): Promise<Testimonial[]> {
  await requireAdminUser()
  return (await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder))) as Testimonial[]
}

export async function createTestimonial(input: Omit<Testimonial, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = testimonialInputSchema.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.insert(testimonials).values(parsed.data)
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateTestimonial(
  id: string,
  input: Partial<Omit<Testimonial, 'id'>>
): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = testimonialInputSchema.partial().safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
