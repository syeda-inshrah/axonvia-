// components/sections/Projects.test.tsx
// The section is off the homepage for now (see the note at the top of Projects.tsx); these tests keep it
// working so it can be restored by rendering it again.
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

const getPublishedProjects = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedProjects }))

const cmsProject = {
  id: '1',
  name: 'RevenueOS',
  description: 'A multi-agent AI system for real estate businesses.',
  stats: ['Multi-agent system'],
  tags: ['Claude API'],
  imageUrl: null,
  link: null,
  isFeatured: true,
  status: 'live' as const,
  sortOrder: 0,
}

describe('Projects (not on the homepage for now)', () => {
  beforeAll(async () => {
    await import('./Projects')
  }, 60_000)
  beforeEach(() => getPublishedProjects.mockReset())

  it('features the admin project marked Featured and lists the others in the grid', async () => {
    getPublishedProjects.mockResolvedValue([cmsProject, { ...cmsProject, id: '2', name: 'Second', isFeatured: false }])
    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByRole('heading', { level: 3, name: 'RevenueOS' })).toBeInTheDocument()
    expect(within(screen.getByTestId('secondary-projects-grid')).getByRole('heading', { level: 4, name: 'Second' })).toBeInTheDocument()
  })

  it('shows an admin project’s image', async () => {
    getPublishedProjects.mockResolvedValue([{ ...cmsProject, imageUrl: 'https://example.com/revenueos.png' }])
    const { Projects } = await import('./Projects')
    render(await Projects())
    expect(screen.getAllByRole('img', { name: 'RevenueOS' })[0]).toHaveAttribute('src', 'https://example.com/revenueos.png')
  })

  it('falls back to a case-studies-in-progress card when there are no projects', async () => {
    getPublishedProjects.mockResolvedValue([])
    const { Projects } = await import('./Projects')
    render(await Projects())
    expect(screen.getByRole('heading', { name: 'Case studies in progress' })).toBeInTheDocument()
    expect(screen.queryByTestId('secondary-projects-grid')).not.toBeInTheDocument()
  })
})
