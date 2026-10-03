'use client'

import { useState, useTransition } from 'react'
import { createProject, updateProject } from '@/app/actions/projects'
import type { Project } from '@/lib/types'

export function ProjectForm({
  project,
  onSaved,
}: {
  project: Project | null
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      stats: project?.stats ?? [],
      tags: project?.tags ?? [],
      imageUrl: project?.imageUrl ?? null,
      link: (formData.get('link') as string) || null,
      isFeatured: project?.isFeatured ?? false,
      status: (project?.status ?? 'coming_soon') as Project['status'],
      sortOrder: project?.sortOrder ?? 0,
    }

    startTransition(async () => {
      const result = project ? await updateProject(project.id, input) : await createProject(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Project name" defaultValue={project?.name} required />
      <textarea
        name="description"
        placeholder="Description"
        defaultValue={project?.description}
        required
      />
      <input name="link" placeholder="Link" defaultValue={project?.link ?? ''} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : project ? 'Save' : 'Add project'}
      </button>
      {error && <p data-testid="project-form-error">{error}</p>}
    </form>
  )
}
