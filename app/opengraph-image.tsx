import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'
import { LogoMark } from '@/components/seo/LogoMark'

// The 1200×630 share image for every page (Open Graph and, via twitter-image.tsx, Twitter/X): dark navy, the
// logo mark, the name and the tagline. Generated at build time.
export const alt = `${siteConfig.name}: ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#FFFFFF',
          background:
            'radial-gradient(circle at 85% 15%, rgba(46,91,255,0.55), transparent 45%), radial-gradient(circle at 10% 95%, rgba(106,75,239,0.45), transparent 50%), #0A1433',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <LogoMark size={64} />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 900 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 30, color: '#C2CBE3', maxWidth: 960, lineHeight: 1.35 }}>
            AI automation agency: workflow automation, intelligent lead management and AI agents.
          </div>
        </div>
      </div>
    ),
    size
  )
}
