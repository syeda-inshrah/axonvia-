import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { newsletterSubscribers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'

export async function GET() {
  try {
    await requireAdminUser()
  } catch {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))

  function csvField(value: string): string {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
    return `"${safe.replace(/"/g, '""')}"`
  }

  const header = 'email,status,created_at'
  const lines = rows.map(
    (row) => `${csvField(row.email)},${csvField(row.status)},${csvField(row.createdAt.toISOString())}`
  )
  const csv = [header, ...lines].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="subscribers.csv"',
    },
  })
}
