'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Lead } from '@/lib/types'

export async function listLeadsForAdmin(): Promise<Lead[]> {
  await requireAdminUser()
  return (await db.select().from(leads).orderBy(desc(leads.createdAt))) as Lead[]
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update' }
  }
}
