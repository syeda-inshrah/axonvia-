import { Badge } from './Badge'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string
  title: string
  highlight?: string
  subtitle?: string
}) {
  const parts = highlight ? title.split(highlight) : [title]

  // Eyebrow, title, and subtitle rise in one after another as the section scrolls into view.
  return (
    <Stagger stagger={0.12} className="text-center max-w-2xl mx-auto">
      <StaggerItem>
        <Badge>{eyebrow}</Badge>
      </StaggerItem>
      <StaggerItem>
        <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
          {highlight ? (
            <>
              {parts[0]}
              <span className="bg-[image:var(--accent-gradient)] bg-clip-text text-transparent">{highlight}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </StaggerItem>
      {subtitle && (
        <StaggerItem>
          <p className="mt-4 text-[var(--text-secondary)] text-lg">{subtitle}</p>
        </StaggerItem>
      )}
    </Stagger>
  )
}
