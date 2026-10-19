import type { ReactNode } from 'react'

/**
 * Left-aligned section opening: the heading takes the first half of the row and the supporting line sits
 * opposite it from md up, so every section starts on the same grid line as the hero.
 */
export function SectionHeader({ title, subtitle, id }: { title: string; subtitle?: ReactNode; id?: string }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end md:gap-10">
      <h2
        id={id}
        className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:col-span-6 md:text-[2.75rem]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-[34rem] text-[var(--text-secondary)] md:col-span-5 md:col-start-7 md:pb-1.5">{subtitle}</p>
      )}
    </div>
  )
}

/** Page section with the shared gutter, width and rhythm. `wash` sets the flat alternate background. */
export function Section({
  id,
  wash = false,
  className = '',
  labelledBy,
  children,
}: {
  id?: string
  wash?: boolean
  className?: string
  labelledBy?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`border-t border-[var(--rule)] px-5 py-20 md:px-10 md:py-28 ${wash ? 'section-alt' : ''} ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  )
}
