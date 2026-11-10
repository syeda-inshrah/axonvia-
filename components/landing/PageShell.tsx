import type { ReactNode } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { ScrollReveals } from '@/components/motion/ScrollReveals'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { FinalCta } from '@/components/sections/FinalCta'
import { JsonLd } from '@/components/seo/JsonLd'

/** The homepage's frame for the services hub and solution pages: same background, navigation, contact form and chat. */
export function PageShell({ jsonLd, children }: { jsonLd: object; children: ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <AmbientBackground />
      <Navbar home={false} />
      <main>
        {children}
        <FinalCta />
      </main>
      <Footer home={false} />
      <ChatWidget />
      <ScrollReveals />
    </>
  )
}

/** Visible breadcrumb trail, matching the BreadcrumbList structured data. */
export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-[var(--text-secondary)]">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="link-underline hover:text-[var(--text-primary)]">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
