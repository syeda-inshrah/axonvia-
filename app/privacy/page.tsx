import type { Metadata } from 'next'
import { LegalPlaceholder } from '@/components/layout/LegalPlaceholder'

const description = 'How Axonvia handles your information.'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description,
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Privacy Policy | Axonvia', description, url: '/privacy' },
}

export default function PrivacyPage() {
  return <LegalPlaceholder title="Privacy Policy" topic="how we handle your information" />
}
