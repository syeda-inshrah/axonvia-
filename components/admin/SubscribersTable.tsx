import type { NewsletterSubscriber } from '@/lib/types'

export function SubscribersTable({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Status</th>
          <th>Subscribed at</th>
        </tr>
      </thead>
      <tbody>
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id}>
            <td>{subscriber.email}</td>
            <td>{subscriber.status}</td>
            <td>{new Date(subscriber.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
