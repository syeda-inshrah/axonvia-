'use client'

import { useState } from 'react'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import type { Project } from '@/lib/types'

export function ProjectsAdminClient({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | null>(null)

  return (
    <>
      <ProjectForm key={editing?.id ?? 'new'} project={editing} onSaved={() => setEditing(null)} />
      <ProjectsTable projects={projects} onEdit={setEditing} />
    </>
  )
}
