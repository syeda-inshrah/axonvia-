import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { AgentStory } from '@/components/sections/AgentStory'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Services } from '@/components/sections/Services'
import { TechStack } from '@/components/sections/TechStack'
import { Process } from '@/components/sections/Process'
import { WhyAxonvia } from '@/components/sections/WhyAxonvia'
import { About } from '@/components/sections/About'
import { WhoWeHelp } from '@/components/sections/WhoWeHelp'
import { FoundingClients } from '@/components/sections/FoundingClients'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  // The FAQ reads admin-published entries from the CMS; render per request so edits show without a rebuild.
  await connection()

  return (
    <>
      <OrganizationJsonLd />
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <AgentStory />
        <Services />
        <Process />
        <WhoWeHelp />
        <WhyAxonvia />
        <About />
        <FoundingClients />
        <TechStack />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollReveals />
    </>
  )
}
