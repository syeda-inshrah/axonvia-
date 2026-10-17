'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Lead } from '@/lib/types'

export async function listLeadsForAdmin(): Promise<Lead[]> {
  await requireAdminUser()
  return (await db.select().from(leads).orderBy(desc(leads.createdAt))) as Lead[]
}

const LEAD_STATUSES: Lead['status'][] = ['new', 'contacted', 'closed']

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  if (!LEAD_STATUSES.includes(status)) return { success: false, error: 'Unknown status' }

  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id))
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update' }
  }
}
