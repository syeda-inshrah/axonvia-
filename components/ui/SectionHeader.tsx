import type { ReactNode } from 'react'

/**
 * Left-aligned section opening: the heading takes the first half of the row and the supporting line sits
 * opposite it from md up. Both rise in as the section scrolls into view.
 */
export function SectionHeader({ title, subtitle, id }: { title: string; subtitle?: ReactNode; id?: string }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end md:gap-10">
      <div data-reveal className="md:col-span-6">
        <h2 id={id} className="text-[2rem] leading-[1.08] font-semibold text-[var(--text-primary)] md:text-[2.75rem]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <div data-reveal className="md:col-span-5 md:col-start-7 md:pb-1.5">
          <p className="max-w-[34rem] text-[var(--text-secondary)]">{subtitle}</p>
        </div>
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
      className={`scroll-mt-16 px-5 py-20 md:px-10 md:py-28 ${wash ? 'section-alt' : ''} ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  )
}
