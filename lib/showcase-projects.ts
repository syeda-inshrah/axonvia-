import type { Project } from '@/lib/types'

export type ShowcaseProject = Project & { demoUrl: string }

/**
 * Projects shown on the site from code, alongside the projects managed in the admin (CMS).
 * Descriptions stick to what each live demo itself states; its usage figures are not repeated because they
 * are unverified.
 */
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'showcase-todo-app',
    name: 'Todo App',
    description:
      'A full-stack task management app: create, update, and organize tasks in a clean, modern interface, with accounts secured by JWT authentication.',
    stats: ['Task management', 'JWT authentication', 'Full-stack web app'],
    tags: ['Next.js 16', 'FastAPI', 'PostgreSQL'],
    imageUrl: null,
    link: null,
    isFeatured: false,
    status: 'live',
    sortOrder: 1000,
    demoUrl: 'https://speckit-hackathon-srha.vercel.app/',
  },
]
