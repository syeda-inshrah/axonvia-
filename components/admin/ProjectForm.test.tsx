import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createProject = vi.fn()
const updateProject = vi.fn()
vi.mock('@/app/actions/projects', () => ({ createProject, updateProject }))

describe('ProjectForm', () => {
  beforeEach(() => {
    createProject.mockReset()
    updateProject.mockReset()
  })

  it('calls createProject when adding a new project', async () => {
    createProject.mockResolvedValue({ success: true })
    const { ProjectForm } = await import('./ProjectForm')
    render(<ProjectForm project={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Project name'), { target: { value: 'RevenueOS' } })
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'desc' } })
    fireEvent.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() => expect(createProject).toHaveBeenCalled())
  })

  it('calls updateProject when editing an existing project', async () => {
    updateProject.mockResolvedValue({ success: true })
    const { ProjectForm } = await import('./ProjectForm')
    const project = {
      id: '1',
      name: 'RevenueOS',
      description: 'desc',
      stats: [],
      tags: [],
      imageUrl: null,
      link: null,
      isFeatured: false,
      status: 'live' as const,
      sortOrder: 0,
    }
    render(<ProjectForm project={project} onSaved={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(updateProject).toHaveBeenCalledWith('1', expect.any(Object)))
  })
})
