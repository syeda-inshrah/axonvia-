import { PageHeader } from '@/components/admin/ui'
import { listLeadsForAdmin } from '@/app/actions/leads'
import { LeadsTable } from '@/components/admin/LeadsTable'

export default async function AdminLeadsPage() {
  const leads = await listLeadsForAdmin()

  return (
    <>
      <PageHeader title="Leads" description="Messages from the website contact form." />
      <LeadsTable leads={leads} />
    </>
  )
}
