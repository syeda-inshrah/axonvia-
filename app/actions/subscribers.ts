'use server'

import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { NewsletterSubscriber } from '@/lib/types'

export async function listSubscribersForAdmin(): Promise<NewsletterSubscriber[]> {
  await requireAdminUser()
  return (await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))) as NewsletterSubscriber[]
}
