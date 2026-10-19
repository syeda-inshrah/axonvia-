'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/actions/projects'
import {
  adminCard,
  adminDangerButton,
  adminSecondaryButton,
  adminTable,
  adminTd,
  adminTh,
  EmptyRow,
  StatusPill,
} from '@/components/admin/ui'
import type { Project } from '@/lib/types'

export function ProjectsTable({ projects, onEdit }: { projects: Project[]; onEdit: (project: Project) => void }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(project: Project) {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteProject(project.id)
    })
  }

  return (
    <div className={`${adminCard} relative overflow-x-auto`}>
      <table className={adminTable}>
        <thead>
          <tr>
            <th className={adminTh}>Name</th>
            <th className={adminTh}>Status</th>
            <th className={adminTh}>Featured</th>
            <th className={adminTh}>Order</th>
            <th className={adminTh}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 && <EmptyRow colSpan={5}>No projects yet. Add one above.</EmptyRow>}
          {projects.map((project) => (
            <tr key={project.id}>
              <td className={`${adminTd} font-medium text-[var(--text-primary)]`}>{project.name}</td>
              <td className={adminTd}>
                {project.status === 'live' ? <StatusPill tone="on">Live</StatusPill> : <StatusPill tone="off">Coming soon</StatusPill>}
              </td>
              <td className={adminTd}>{project.isFeatured ? <StatusPill tone="warn">Featured</StatusPill> : '—'}</td>
              <td className={adminTd}>{project.sortOrder}</td>
              <td className={`${adminTd} text-right`}>
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(project)} className={adminSecondaryButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project)} disabled={isPending} className={adminDangerButton}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
