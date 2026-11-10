import { LandingPage } from '@/components/landing/LandingPage'
import { pageMetadata } from '@/lib/page-metadata'
import { realEstate } from '@/lib/landing-pages'

export const metadata = pageMetadata({ title: realEstate.metaTitle, description: realEstate.description, path: realEstate.path })

export default function RealEstateAiAutomationPage() {
  return <LandingPage page={realEstate} />
}
