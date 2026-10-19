import { SimplePage } from '@/components/layout/SimplePage'
import { siteConfig } from '@/lib/site'

// Holding page until the real document is written; deliberately states no legal terms of its own.
export function LegalPlaceholder({ title, topic }: { title: string; topic: string }) {
  return (
    <SimplePage>
      <p className="text-sm font-medium text-[var(--accent-purple)]">Legal</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">{title}</h1>
      <p className="mt-6 text-lg text-[var(--text-secondary)]">
        Our {title.toLowerCase()} is being finalised and will be published here before we start taking on client
        work through this site.
      </p>
      <p className="mt-4 text-[var(--text-secondary)]">
        Until then, if you have any questions about {topic}, email us at{' '}
        <a href={`mailto:${siteConfig.contactEmail}`} className="link-underline text-[var(--accent-cyan)]">
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </SimplePage>
  )
}
