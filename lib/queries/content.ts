import { db } from '@/lib/db'
import { projects, testimonials, faqs } from '@/lib/db/schema'
import { diagnoseDbError } from '@/lib/db/diagnose'
import { describeConnection, explain } from '@/lib/db/identity'
import { eq, asc } from 'drizzle-orm'
import type { Project, Testimonial, Faq } from '@/lib/types'

// The homepage must render even when the CMS tables can't be read, so each query falls back to an empty list.
// The failure is still logged loudly, as one JSON line (Vercel → Logs) naming the query, the kind of failure
// (e.g. missing_table: migrations not applied) and what to do, so a schema problem is never silently hidden.
// Awaited (on the error path only) so serverless platforms don't freeze the function before the line is written.
async function logQueryFailure(query: string, error: unknown) {
  const failure = diagnoseDbError(error)
  console.error(JSON.stringify({ event: 'db_query_error', query, ...failure }))
  if (failure.kind === 'missing_table') await logConnectionIdentity()
}

// When a table seems missing, log once per server instance what this runtime's connection actually sees
// (host, database, role, search_path, where each table lives). Compare it with `npm run db:status` locally:
// any difference is the cause. Read-only catalog queries; no credentials are logged.
let identityLogged = false
async function logConnectionIdentity() {
  if (identityLogged) return
  identityLogged = true
  try {
    const identity = await describeConnection(db)
    console.error(JSON.stringify({ event: 'db_connection_identity', ...identity, verdict: explain(identity) }))
  } catch (error) {
    console.error(JSON.stringify({ event: 'db_connection_identity', error: diagnoseDbError(error).message }))
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    return (await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'live'))
      .orderBy(asc(projects.sortOrder))) as Project[]
  } catch (error) {
    await logQueryFailure('getPublishedProjects', error)
    return []
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    return (await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder))) as Testimonial[]
  } catch (error) {
    await logQueryFailure('getPublishedTestimonials', error)
    return []
  }
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  try {
    return (await db
      .select()
      .from(faqs)
      .where(eq(faqs.isPublished, true))
      .orderBy(asc(faqs.sortOrder))) as Faq[]
  } catch (error) {
    await logQueryFailure('getPublishedFaqs', error)
    return []
  }
}
