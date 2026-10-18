// components/sections/Projects.test.tsx
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

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

describe('Projects', () => {
  beforeEach(() => getPublishedProjects.mockReset())

  it('features the Todo App with an accurate description, its stack, a real preview, and a Live Demo button', async () => {
    getPublishedProjects.mockResolvedValue([])
    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Todo App' })).toBeInTheDocument()
    expect(screen.getByText(/create, update, and organize tasks/i)).toBeInTheDocument()
    for (const tag of ['Next.js 16', 'FastAPI', 'PostgreSQL']) expect(screen.getByText(tag)).toBeInTheDocument()

    const preview = screen.getByRole('img', { name: /Todo App landing page/ })
    expect(preview).toHaveAttribute('src', '/projects/todo-app.jpg')
    expect(preview).toHaveAttribute('width', '1280')
    expect(preview).toHaveAttribute('height', '800')

    const demo = screen.getByRole('link', { name: 'Live Demo: Todo App (opens in a new tab)' })
    expect(demo).toHaveAttribute('href', 'https://speckit-hackathon-srha.vercel.app/')
    expect(demo).toHaveAttribute('target', '_blank')
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows no placeholder content: no gradient stand-in, no unverified usage figures', async () => {
    getPublishedProjects.mockResolvedValue([])
    const { Projects } = await import('./Projects')
    const { container } = render(await Projects())

    expect(container.querySelector('[data-placeholder-visual]')).toBeNull()
    expect(container).not.toHaveTextContent(/10K\+|50K\+|99\.9%|placeholder/i)
  })

  it('keeps the Todo App featured and lists admin-managed projects in the grid after it', async () => {
    getPublishedProjects.mockResolvedValue([cmsProject])
    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByRole('heading', { level: 3, name: 'Todo App' })).toBeInTheDocument()
    const grid = screen.getByTestId('secondary-projects-grid')
    expect(within(grid).getByRole('heading', { level: 4, name: 'RevenueOS' })).toBeInTheDocument()
    expect(within(grid).getByText('Claude API')).toBeInTheDocument()
  })

  it('shows an admin project’s image in its grid card', async () => {
    getPublishedProjects.mockResolvedValue([{ ...cmsProject, imageUrl: 'https://example.com/revenueos.png' }])
    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(within(screen.getByTestId('secondary-projects-grid')).getByRole('img', { name: 'RevenueOS' })).toHaveAttribute(
      'src',
      'https://example.com/revenueos.png'
    )
  })

  it('omits the grid when there are no admin projects', async () => {
    getPublishedProjects.mockResolvedValue([])
    const { Projects } = await import('./Projects')
    render(await Projects())
    expect(screen.queryByTestId('secondary-projects-grid')).not.toBeInTheDocument()
  })

  it('falls back to a case-studies-in-progress card only if there are no projects of any kind', async () => {
    vi.resetModules()
    vi.doMock('@/lib/showcase-projects', () => ({ showcaseProjects: [] }))
    getPublishedProjects.mockResolvedValue([])

    const { Projects } = await import('./Projects')
    render(await Projects())

    expect(screen.getByRole('heading', { name: 'Case studies in progress' })).toBeInTheDocument()
    vi.doUnmock('@/lib/showcase-projects')
    vi.resetModules()
  })
})
