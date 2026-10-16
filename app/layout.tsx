import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { MotionSafeProvider } from '@/components/ui/MotionSafeProvider'
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

export const metadata = {
  title: 'Axonvia — Intelligence that works for your business.',
  description:
    'Axonvia designs and builds AI automation, agentic AI systems, custom AI-powered applications, and business workflow automation — shaped around how your business actually works.',
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
