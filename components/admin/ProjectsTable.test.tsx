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
    render(<ProjectsTable projects={[project]} onEdit={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('1'))
  })
})
