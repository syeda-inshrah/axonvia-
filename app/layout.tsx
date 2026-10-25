import type { Metadata, Viewport } from 'next'
import { Schibsted_Grotesk, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import { SITE_URL, siteConfig } from '@/lib/site'
import { MotionProvider } from '@/components/ui/MotionProvider'
import './globals.css'

// One family for headings and body; the mono face is reserved for real data such as timestamps.
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
})

// Serif for large editorial statements only; everything else is set in Schibsted Grotesk.
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  // Used only below the fold; not preloading it leaves bandwidth for the headline font on slow connections.
  preload: false,
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  preload: false,
})

// Marks the page as scripted so the hero intro and scroll reveals can stay hidden until GSAP plays them. If
// GSAP hasn't started within 3s (slow device, blocked script), intro-timeout reveals everything as plain content.
const scriptFlag = `document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('intro-timeout')},3000)`

const title = 'Axonvia | AI Automation Agency: Workflow Automation, Lead Management & AI Agents'
const description =
  'Axonvia helps businesses automate operations, manage leads intelligently, and build AI-powered systems that save time and support growth. Book a free automation audit.'

// All absolute URLs (Open Graph, canonical, share images) resolve against SITE_URL (lib/site.ts). Canonical
// URLs are set per page, so no page inherits the homepage's. The share image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: '%s | Axonvia' },
  description,
  applicationName: siteConfig.name,
  openGraph: { title, description, siteName: siteConfig.name, type: 'website', locale: 'en_US', url: '/' },
  twitter: { card: 'summary_large_image', site: siteConfig.xHandle, title, description },
}

export const viewport: Viewport = {
  themeColor: '#F6F7FC',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${schibsted.variable} ${instrument.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptFlag }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
