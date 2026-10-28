import { SimplePage } from '@/components/layout/SimplePage'
import { siteConfig } from '@/lib/site'

/** Layout for the legal pages: title, date of the current version, then the document's sections. */
export function LegalDocument({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <SimplePage>
      <p className="text-sm font-medium text-[var(--accent-purple)]">Legal</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">{title}</h1>
      <p className="mt-4 text-sm text-[var(--text-muted)]">Last updated {updated}</p>
      <div className="mt-8 space-y-4 text-[var(--text-secondary)] [&_a]:text-[var(--accent-cyan)] [&_a]:underline [&_h2]:pt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </SimplePage>
  )
}

export function ContactEmail() {
  return <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
}
