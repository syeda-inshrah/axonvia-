'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdminUser } from '@/lib/require-admin'
import type { ActionResult } from '@/app/actions/contact'
import type { Project } from '@/lib/types'

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

  try {
    await db.insert(projects).values(input)
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

  try {
    await db.update(projects).set(input).where(eq(projects.id, id))
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
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete' }
  }
}
