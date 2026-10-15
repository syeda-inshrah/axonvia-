import { Badge } from './Badge'

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

  return (
    <div className="text-center max-w-2xl mx-auto">
      <Badge>{eyebrow}</Badge>
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
      {subtitle && <p className="mt-4 text-[var(--text-secondary)] text-lg">{subtitle}</p>}
    </div>
  )
}
