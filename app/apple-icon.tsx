import { ImageResponse } from 'next/og'
import { LogoMark } from '@/components/seo/LogoMark'

// 180×180 home-screen icon for iOS, generated from the same mark as the favicon (app/icon.svg).
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1433' }}>
        <LogoMark size={132} />
      </div>
    ),
    size
  )
}
