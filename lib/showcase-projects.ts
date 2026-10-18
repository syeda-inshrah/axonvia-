import type { Project } from '@/lib/types'

export type ShowcaseProject = Project & {
  demoUrl: string
  /** Real screenshot in /public, with its intrinsic size so the layout never shifts while it loads. */
  image: { src: string; alt: string; width: number; height: number }
}

/**
 * Projects shown from code, featured ahead of the projects managed in the admin (CMS).
 * Descriptions stick to what each live demo itself states; its usage figures are not repeated because they
 * are unverified.
 */
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'showcase-todo-app',
    name: 'Todo App',
    description:
      'A modern task management web app that helps people stay productive and focused. Users can create, update, and organize tasks through a clean, intuitive interface, with accounts secured by JWT authentication. Built full-stack, with a Next.js 16 front end, a FastAPI back end, and a PostgreSQL database.',
    stats: ['Task management', 'JWT authentication', 'Full-stack web app'],
    tags: ['Next.js 16', 'FastAPI', 'PostgreSQL'],
    imageUrl: null,
    link: null,
    isFeatured: true,
    status: 'live',
    sortOrder: 0,
    demoUrl: 'https://speckit-hackathon-srha.vercel.app/',
    image: {
      src: '/projects/todo-app.jpg',
      alt: 'Todo App landing page: “Organize Your Life One Task at a Time”',
      width: 1280,
      height: 800,
    },
  },
]
