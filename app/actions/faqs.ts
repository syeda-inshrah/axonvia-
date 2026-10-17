'use server'

import { db } from '@/lib/db'
import { faqs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminUser } from '@/lib/require-admin'
import { faqInputSchema } from '@/lib/validations'
import type { ActionResult } from '@/app/actions/contact'
import type { Faq } from '@/lib/types'

// Refresh the admin list and the public homepage that renders this content.
function refresh() {
  revalidatePath('/admin/faqs')
  revalidatePath('/')
}

function invalid(error: { issues: { message: string }[] }): ActionResult {
  return { success: false, error: error.issues[0]?.message ?? 'Invalid input' }
}

export async function listFaqsForAdmin(): Promise<Faq[]> {
  await requireAdminUser()
  return (await db.select().from(faqs).orderBy(asc(faqs.sortOrder))) as Faq[]
}

export async function createFaq(input: Omit<Faq, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = faqInputSchema.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.insert(faqs).values(parsed.data)
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateFaq(id: string, input: Partial<Omit<Faq, 'id'>>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = faqInputSchema.partial().safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.update(faqs).set(parsed.data).where(eq(faqs.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(faqs).where(eq(faqs.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
