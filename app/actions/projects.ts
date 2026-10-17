'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminUser } from '@/lib/require-admin'
import { projectInputSchema } from '@/lib/validations'
import type { ActionResult } from '@/app/actions/contact'
import type { Project } from '@/lib/types'

// Refresh the admin list and the public homepage that renders this content.
function refresh() {
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

function invalid(error: { issues: { message: string }[] }): ActionResult {
  return { success: false, error: error.issues[0]?.message ?? 'Invalid input' }
}

export async function listProjectsForAdmin(): Promise<Project[]> {
  await requireAdminUser()
  return (await db.select().from(projects).orderBy(asc(projects.sortOrder))) as Project[]
}

export async function createProject(input: Omit<Project, 'id'>): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = projectInputSchema.safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.insert(projects).values(parsed.data)
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, 'id'>>
): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const parsed = projectInputSchema.partial().safeParse(input)
  if (!parsed.success) return invalid(parsed.error)

  try {
    await db.update(projects).set(parsed.data).where(eq(projects.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' }
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdminUser()
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.delete(projects).where(eq(projects.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
