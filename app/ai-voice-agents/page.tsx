import { LandingPage } from '@/components/landing/LandingPage'
import { pageMetadata } from '@/lib/page-metadata'
import { voiceAgents } from '@/lib/landing-pages'

export const metadata = pageMetadata({ title: voiceAgents.metaTitle, description: voiceAgents.description, path: voiceAgents.path })

export default function AiVoiceAgentsPage() {
  return <LandingPage page={voiceAgents} />
}
