import { PageHeader } from '@/components/admin/ui'
import { listProjectsForAdmin } from '@/app/actions/projects'
import { ProjectsAdminClient } from '@/components/admin/ProjectsAdminClient'

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin()

  return (
    <>
      <PageHeader title="Projects" description="Case studies shown in the Projects section. Only Live projects are public." />
      <ProjectsAdminClient projects={projects} />
    </>
  )
}
