import { listSubscribersForAdmin } from '@/app/actions/subscribers'
import { SubscribersTable } from '@/components/admin/SubscribersTable'

export default async function AdminNewsletterPage() {
  const subscribers = await listSubscribersForAdmin()

  return (
    <main>
      <h1>Newsletter Subscribers</h1>
      <a href="/admin/newsletter/export">Export CSV</a>
      <SubscribersTable subscribers={subscribers} />
    </main>
  )
}
