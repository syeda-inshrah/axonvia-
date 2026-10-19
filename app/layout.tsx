import type { Metadata, Viewport } from 'next'
import { Schibsted_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { MotionSafeProvider } from '@/components/ui/MotionSafeProvider'
import { siteConfig } from '@/lib/site'
import './globals.css'

// One family for headings and body; the mono face is reserved for real data such as timestamps.
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

// Marks the page as scripted so the hero can hide its intro until GSAP plays it. If GSAP hasn't started
// within 3s (slow device, blocked script), intro-timeout reveals everything as plain content.
const scriptFlag = `document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('intro-timeout')},3000)`

const title = 'Axonvia — Intelligence that works for your business.'
const description =
  'Axonvia designs and builds AI automation, agentic AI systems, custom AI-powered applications, and business workflow automation — shaped around how your business actually works.'

// metadataBase comes from NEXT_PUBLIC_SITE_URL; until it's set, share links resolve to localhost.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  openGraph: { title, description, siteName: 'Axonvia', type: 'website', locale: 'en_US', url: '/' },
  twitter: { card: 'summary', title, description },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${schibsted.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptFlag }} />
      </head>
      <body>
        <MotionSafeProvider>{children}</MotionSafeProvider>
      </body>
    </html>
  )
}
