import { PageHeader, adminSecondaryButton } from '@/components/admin/ui'
import { listSubscribersForAdmin } from '@/app/actions/subscribers'
import { SubscribersTable } from '@/components/admin/SubscribersTable'

export default async function AdminNewsletterPage() {
  const subscribers = await listSubscribersForAdmin()

  return (
    <>
      <PageHeader
        title="Newsletter"
        description={`${subscribers.filter((subscriber) => subscriber.status === 'subscribed').length} active subscribers.`}
        actions={
          <a href="/admin/newsletter/export" className={adminSecondaryButton}>
            Export CSV
          </a>
        }
      />
      <SubscribersTable subscribers={subscribers} />
    </>
  )
}
