import { LandingPage } from '@/components/landing/LandingPage'
import { pageMetadata } from '@/lib/page-metadata'
import { chatbots } from '@/lib/landing-pages'

export const metadata = pageMetadata({ title: chatbots.metaTitle, description: chatbots.description, path: chatbots.path })

export default function AiChatbotsPage() {
  return <LandingPage page={chatbots} />
}
