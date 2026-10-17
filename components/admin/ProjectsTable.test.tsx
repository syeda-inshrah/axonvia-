import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const deleteProject = vi.fn(async () => ({ success: true }))
vi.mock('@/app/actions/projects', () => ({ deleteProject }))

describe('ProjectsTable', () => {
  it('calls deleteProject when the delete button is clicked', async () => {
    const { ProjectsTable } = await import('./ProjectsTable')
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
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ProjectsTable projects={[project]} onEdit={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(confirm).toHaveBeenCalledWith('Delete "RevenueOS"? This cannot be undone.')
    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('1'))
    confirm.mockRestore()
  })

  it('does nothing when the delete is not confirmed', async () => {
    deleteProject.mockClear()
    const { ProjectsTable } = await import('./ProjectsTable')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(
      <ProjectsTable
        projects={[{ id: '1', name: 'RevenueOS', description: 'd', stats: [], tags: [], imageUrl: null, link: null, isFeatured: false, status: 'live', sortOrder: 0 }]}
        onEdit={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(deleteProject).not.toHaveBeenCalled()
    confirm.mockRestore()
  })
})
