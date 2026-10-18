import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { MotionSafeProvider } from '@/components/ui/MotionSafeProvider'
import { siteConfig } from '@/lib/site'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <MotionSafeProvider>{children}</MotionSafeProvider>
      </body>
    </html>
  )
}
