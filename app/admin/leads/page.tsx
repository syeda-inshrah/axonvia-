import { listLeadsForAdmin } from '@/app/actions/leads'
import { LeadsTable } from '@/components/admin/LeadsTable'

export default async function AdminLeadsPage() {
  const leads = await listLeadsForAdmin()

  return (
    <main>
      <h1>Leads</h1>
      <LeadsTable leads={leads} />
    </main>
  )
}
