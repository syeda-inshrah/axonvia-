'use server'

import { db } from '@/lib/db'
import { faqs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Faq } from '@/lib/types'

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

  try {
    await db.insert(faqs).values(input)
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

  try {
    await db.update(faqs).set(input).where(eq(faqs.id, id))
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
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
