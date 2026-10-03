'use server'

import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Testimonial } from '@/lib/types'

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

  try {
    await db.insert(testimonials).values(input)
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

  try {
    await db.update(testimonials).set(input).where(eq(testimonials.id, id))
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
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
