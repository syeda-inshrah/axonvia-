import { connection } from 'next/server'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { AgentStory } from '@/components/sections/AgentStory'
import { AmbientBackground } from '@/components/motion/AmbientBackground'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { TechStack } from '@/components/sections/TechStack'
import { Process } from '@/components/sections/Process'
import { WhyAxonvia } from '@/components/sections/WhyAxonvia'
import { About } from '@/components/sections/About'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

export default async function HomePage() {
  // Projects, Testimonials and FAQ read the CMS; render per request so edits show without a rebuild.
  await connection()

  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <AgentStory />
        <Services />
        <Projects />
        <Process />
        <WhyAxonvia />
        <About />
        <TechStack />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollReveals />
    </>
  )
}
