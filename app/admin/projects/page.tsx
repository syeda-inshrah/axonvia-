import { listProjectsForAdmin } from '@/app/actions/projects'
import { ProjectsAdminClient } from '@/components/admin/ProjectsAdminClient'

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin()

  return (
    <main>
      <h1>Projects</h1>
      <ProjectsAdminClient projects={projects} />
    </main>
  )
}
