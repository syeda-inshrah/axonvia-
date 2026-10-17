import { SimplePage } from '@/components/layout/SimplePage'
import { UnsubscribeForm } from '@/components/UnsubscribeForm'
import { siteConfig } from '@/lib/site'

export const metadata = { title: 'Unsubscribe — Axonvia', robots: { index: false } }

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const email = first(params.email)
  const token = first(params.token)

  return (
    <SimplePage>
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Unsubscribe from Axonvia updates</h1>
      {email && token ? (
        <>
          <p className="mt-6 text-lg text-[var(--text-secondary)]">
            Stop sending newsletter emails to <strong className="text-[var(--text-primary)]">{email}</strong>?
          </p>
          <UnsubscribeForm email={email} token={token} />
        </>
      ) : (
        <p className="mt-6 text-lg text-[var(--text-secondary)]">
          This unsubscribe link is incomplete. Use the link from your most recent Axonvia email, or email{' '}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline text-[var(--accent-cyan)]">
            {siteConfig.contactEmail}
          </a>{' '}
          and we&apos;ll remove you.
        </p>
      )}
    </SimplePage>
  )
}
