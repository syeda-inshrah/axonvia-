'use client'

import { useState, useTransition } from 'react'
import { createProject, updateProject } from '@/app/actions/projects'
import {
  adminCard,
  adminInput,
  adminPrimaryButton,
  adminSecondaryButton,
  Checkbox,
  Field,
  FormError,
  toOptionalUrl,
  toSortOrder,
} from '@/components/admin/ui'
import type { Project } from '@/lib/types'

function lines(value: FormDataEntryValue | null, separator: string | RegExp): string[] {
  return String(value ?? '')
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ProjectForm({
  project,
  onSaved,
  onCancel,
}: {
  project: Project | null
  onSaved: () => void
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    const input = {
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      status: (formData.get('status') === 'live' ? 'live' : 'coming_soon') as Project['status'],
      isFeatured: formData.get('isFeatured') === 'on',
      stats: lines(formData.get('stats'), '\n'),
      tags: lines(formData.get('tags'), ','),
      sortOrder: toSortOrder(formData.get('sortOrder')),
      link: toOptionalUrl(formData.get('link')),
      imageUrl: toOptionalUrl(formData.get('imageUrl')),
    }

    startTransition(async () => {
      const result = project ? await updateProject(project.id, input) : await createProject(input)
      setError(result.success ? null : result.error ?? 'Failed to save')
      if (result.success) onSaved()
    })
  }

  return (
    <form action={handleSubmit} className={`${adminCard} mb-8 flex flex-col gap-4 p-6`}>
      <h2 className="font-semibold text-[var(--text-primary)]">{project ? `Edit ${project.name}` : 'Add a project'}</h2>

      <Field label="Project name">
        {(id) => <input id={id} name="name" placeholder="Project name" defaultValue={project?.name} required className={adminInput} />}
      </Field>
      <Field label="Description">
        {(id) => (
          <textarea id={id} name="description" placeholder="Description" defaultValue={project?.description} required rows={3} className={adminInput} />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" hint="Only Live projects appear on the website.">
          {(id) => (
            <select id={id} name="status" defaultValue={project?.status ?? 'coming_soon'} className={adminInput}>
              <option value="coming_soon">Coming soon (hidden)</option>
              <option value="live">Live</option>
            </select>
          )}
        </Field>
        <Field label="Sort order" hint="Lower numbers show first.">
          {(id) => <input id={id} name="sortOrder" type="number" min={0} defaultValue={project?.sortOrder ?? 0} className={adminInput} />}
        </Field>
        <Field label="Stats (one per line)">
          {(id) => <textarea id={id} name="stats" rows={3} defaultValue={project?.stats.join('\n')} className={adminInput} />}
        </Field>
        <Field label="Tags (comma-separated)">
          {(id) => <textarea id={id} name="tags" rows={3} defaultValue={project?.tags.join(', ')} className={adminInput} />}
        </Field>
        <Field label="Link" hint="Optional. Full https:// URL.">
          {(id) => <input id={id} name="link" type="url" placeholder="https://" defaultValue={project?.link ?? ''} className={adminInput} />}
        </Field>
        <Field label="Image URL" hint="Optional. Shown on the featured project.">
          {(id) => <input id={id} name="imageUrl" type="url" placeholder="https://" defaultValue={project?.imageUrl ?? ''} className={adminInput} />}
        </Field>
      </div>

      <Checkbox name="isFeatured" label="Featured on the homepage" defaultChecked={project?.isFeatured} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className={adminPrimaryButton}>
          {isPending ? 'Saving…' : project ? 'Save' : 'Add project'}
        </button>
        {project && onCancel && (
          <button type="button" onClick={onCancel} className={adminSecondaryButton}>
            Cancel
          </button>
        )}
      </div>
      {error && <FormError testId="project-form-error">{error}</FormError>}
    </form>
  )
}
