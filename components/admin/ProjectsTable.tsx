'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/actions/projects'
import type { Project } from '@/lib/types'

export function ProjectsTable({
  projects,
  onEdit,
}: {
  projects: Project[]
  onEdit: (project: Project) => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProject(id)
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Featured</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.status}</td>
            <td>{project.isFeatured ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project.id)} disabled={isPending}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
