import type { Metadata } from 'next'
import { LegalPlaceholder } from '@/components/layout/LegalPlaceholder'

const description = 'The terms for working with Axonvia.'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description,
  alternates: { canonical: '/terms' },
  openGraph: { title: 'Terms of Service | Axonvia', description, url: '/terms' },
}

export default function TermsPage() {
  return <LegalPlaceholder title="Terms of Service" topic="working with Axonvia" />
}
