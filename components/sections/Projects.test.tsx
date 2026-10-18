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

  it('lists the showcase project in the grid after a CMS featured project, with a Live Demo link', async () => {
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

    expect(screen.getByText('RevenueOS').tagName).toBe('H3')
    const grid = screen.getByTestId('secondary-projects-grid')
    expect(grid).toHaveTextContent('Todo App')
    const demo = screen.getByRole('link', { name: 'Live Demo: Todo App (opens in a new tab)' })
    expect(grid).toContainElement(demo)
    expect(demo).toHaveAttribute('href', 'https://speckit-hackathon-srha.vercel.app/')
  })

  it('features the showcase project, with stack tags and a Live Demo button, when the CMS has no live projects', async () => {
    getPublishedProjects.mockResolvedValue([])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Todo App' })).toBeInTheDocument()
    for (const tag of ['Next.js 16', 'FastAPI', 'PostgreSQL']) expect(screen.getByText(tag)).toBeInTheDocument()

    const demo = screen.getByRole('link', { name: 'Live Demo: Todo App (opens in a new tab)' })
    expect(demo).toHaveAttribute('href', 'https://speckit-hackathon-srha.vercel.app/')
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer')
    // The demo site's own usage numbers are unverified, so the card must not repeat them.
    expect(document.body).not.toHaveTextContent(/10K\+|50K\+|99\.9%/)
  })

  it('shows a case-studies-in-progress card when there are no CMS or showcase projects at all', async () => {
    vi.resetModules()
    vi.doMock('@/lib/showcase-projects', () => ({ showcaseProjects: [] }))
    getPublishedProjects.mockResolvedValue([])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByRole('heading', { name: 'Case studies in progress' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Discuss your project' })).toHaveAttribute('href', '#final-cta')
    vi.doUnmock('@/lib/showcase-projects')
    vi.resetModules()
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
