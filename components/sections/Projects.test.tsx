// components/sections/Projects.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getPublishedProjects = vi.fn()
vi.mock('@/lib/queries/content', () => ({ getPublishedProjects }))

describe('Projects', () => {
  beforeEach(() => getPublishedProjects.mockReset())

  it('renders the first featured project as the Featured Project card', async () => {
    getPublishedProjects.mockResolvedValue([
      {
        id: '1',
        name: 'RevenueOS',
        description: 'A multi-agent AI system for real estate businesses.',
        stats: ['Multi-agent system'],
        tags: ['Claude API'],
        imageUrl: null,
        link: null,
        isFeatured: true,
        status: 'live',
        sortOrder: 0,
      },
    ])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByText('RevenueOS')).toBeInTheDocument()
    expect(screen.getByText('Claude API')).toBeInTheDocument()
  })

  it('omits the secondary grid when there are no remaining projects', async () => {
    getPublishedProjects.mockResolvedValue([
      {
        id: '1',
        name: 'RevenueOS',
        description: 'desc',
        stats: [],
        tags: [],
        imageUrl: null,
        link: null,
        isFeatured: true,
        status: 'live',
        sortOrder: 0,
      },
    ])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.queryByTestId('secondary-projects-grid')).not.toBeInTheDocument()
  })

  it('shows a case-studies-in-progress card when there are no live projects at all', async () => {
    getPublishedProjects.mockResolvedValue([])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByRole('heading', { name: 'Case studies in progress' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Discuss your project' })).toHaveAttribute('href', '#final-cta')
  })

  it('features the first isFeatured project even when it is not first, and lists the rest in the grid', async () => {
    const base = { stats: [], tags: [], imageUrl: null, link: null, status: 'live', description: 'desc' }
    getPublishedProjects.mockResolvedValue([
      { ...base, id: '1', name: 'Ordinary Project', isFeatured: false, sortOrder: 0 },
      { ...base, id: '2', name: 'Flagship Project', isFeatured: true, sortOrder: 1 },
    ])

    const { Projects } = await import('./Projects')
    render(await Projects())

    const featuredHeading = screen.getByText('Flagship Project')
    expect(featuredHeading.tagName).toBe('H3')
    expect(screen.getByTestId('secondary-projects-grid')).toHaveTextContent('Ordinary Project')
  })

  it('shows the featured project image when the CMS has one', async () => {
    getPublishedProjects.mockResolvedValue([
      { id: '1', name: 'RevenueOS', description: 'd', stats: [], tags: [], imageUrl: 'https://example.com/revenueos.png', link: null, isFeatured: true, status: 'live', sortOrder: 0 },
    ])
    const { Projects } = await import('./Projects')
    render(await Projects())
    expect(screen.getByRole('img', { name: 'RevenueOS' })).toHaveAttribute('src', 'https://example.com/revenueos.png')
  })
})
