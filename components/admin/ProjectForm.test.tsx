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

  it('lets the admin publish, feature, order, and describe a project in full', async () => {
    createProject.mockResolvedValue({ success: true })
    const { ProjectForm } = await import('./ProjectForm')
    render(<ProjectForm project={null} onSaved={() => {}} />)

    fireEvent.change(screen.getByLabelText('Project name'), { target: { value: 'RevenueOS' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'An AI sales assistant.' } })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'live' } })
    fireEvent.click(screen.getByLabelText('Featured on the homepage'))
    fireEvent.change(screen.getByLabelText('Stats (one per line)'), { target: { value: '40% faster replies\n\n3x more demos ' } })
    fireEvent.change(screen.getByLabelText('Tags (comma-separated)'), { target: { value: 'Next.js, Claude API,' } })
    fireEvent.change(screen.getByLabelText('Sort order'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Link'), { target: { value: 'https://example.com/case' } })
    fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() =>
      expect(createProject).toHaveBeenCalledWith({
        name: 'RevenueOS',
        description: 'An AI sales assistant.',
        status: 'live',
        isFeatured: true,
        stats: ['40% faster replies', '3x more demos'],
        tags: ['Next.js', 'Claude API'],
        sortOrder: 2,
        link: 'https://example.com/case',
        imageUrl: null,
      })
    )
  })
})
