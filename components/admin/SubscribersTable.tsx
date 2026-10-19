import { adminCard, adminTable, adminTd, adminTh, EmptyRow, StatusPill } from '@/components/admin/ui'
import type { NewsletterSubscriber } from '@/lib/types'

export function SubscribersTable({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  return (
    <div className={`${adminCard} relative overflow-x-auto`}>
      <table className={adminTable}>
        <thead>
          <tr>
            <th className={adminTh}>Email</th>
            <th className={adminTh}>Status</th>
            <th className={adminTh}>Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length === 0 && <EmptyRow colSpan={3}>No subscribers yet.</EmptyRow>}
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td className={`${adminTd} text-[var(--text-primary)]`}>{subscriber.email}</td>
              <td className={adminTd}>
                {subscriber.status === 'subscribed' ? (
                  <StatusPill tone="on">Subscribed</StatusPill>
                ) : (
                  <StatusPill tone="off">Unsubscribed</StatusPill>
                )}
              </td>
              <td className={`${adminTd} whitespace-nowrap`}>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
