import { getPublishedProjects } from '@/lib/queries/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'

export async function Projects() {
  const projects = await getPublishedProjects()
  const featured = projects.find((project) => project.isFeatured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  return (
    <section id="projects" className="px-5 md:px-10 py-24 section-alt">
      <SectionHeader eyebrow="Our Work" title="Systems We've Built" />

      <div className="mt-12 max-w-[1320px] mx-auto">
        {!featured && <p className="text-center text-[var(--text-secondary)]">Projects coming soon.</p>}

        {featured && (
          <GlassCard className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">
            <div className="rounded-xl bg-[var(--bg-card)] min-h-[220px]" aria-hidden="true" />
            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">Featured Project</span>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{featured.name}</h3>
              <p className="mt-3 text-[var(--text-secondary)]">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.stats.map((stat) => (
                  <span
                    key={stat}
                    className="rounded-full border border-[var(--border-glass)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {stat}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-[var(--text-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
              {featured.link && (
                <Button href={featured.link} variant="ghost" className="mt-4">
                  View Details →
                </Button>
              )}
            </div>
          </GlassCard>
        )}

        {rest.length > 0 && (
          <div data-testid="secondary-projects-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project) => (
              <GlassCard key={project.id}>
                <h4 className="text-lg font-semibold text-[var(--text-primary)]">{project.name}</h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{project.description}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
