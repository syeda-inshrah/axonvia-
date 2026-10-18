import { getPublishedProjects } from '@/lib/queries/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { ExternalLink } from 'lucide-react'
import { showcaseProjects, type ShowcaseProject } from '@/lib/showcase-projects'
import { buttonClasses } from '@/components/ui/buttonStyles'
import type { Project } from '@/lib/types'

type DisplayProject = Project | ShowcaseProject

function demoUrlOf(project: DisplayProject): string | null {
  return 'demoUrl' in project ? project.demoUrl : null
}

// External demo link: opens in a new tab, and says so to screen readers.
function LiveDemoButton({ project, className = '' }: { project: DisplayProject; className?: string }) {
  const url = demoUrlOf(project)
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Live Demo: ${project.name} (opens in a new tab)`}
      className={buttonClasses('primary', 'default', `gap-2 ${className}`)}
    >
      Live Demo
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
    </a>
  )
}

export async function Projects() {
  // CMS projects first (they keep their admin-set order and featured flag), then the built-in showcase.
  const projects: DisplayProject[] = [...(await getPublishedProjects()), ...showcaseProjects]
  const featured = projects.find((project) => project.isFeatured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  return (
    <section id="projects" className="px-5 md:px-10 py-24 section-alt">
      <SectionHeader eyebrow="Our Work" title="Systems We've Built" />

      <div className="mt-12 max-w-[1320px] mx-auto">
        {!featured && (
          <GlassCard glow={false} className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Case studies in progress</h3>
            <p className="mt-3 text-[var(--text-secondary)]">
              We&apos;re writing up recent builds with the detail they deserve. In the meantime, we&apos;re happy to
              walk you through our approach on a call.
            </p>
            <Button href="#final-cta" variant="secondary" className="mt-5">
              Discuss your project
            </Button>
          </GlassCard>
        )}

        {featured && (
          <GlassCard className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">
            {featured.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- Plain <img>: CMS image URLs can be on any host, which next/image would need configured.
              <img
                src={featured.imageUrl}
                alt={featured.name}
                className="min-h-[220px] w-full rounded-xl object-cover"
              />
            ) : (
              // Visual placeholder until a project image URL is set in the admin.
              <div
                className="relative min-h-[220px] overflow-hidden rounded-xl bg-[var(--bg-card)] grid-texture"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,255,0.18),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(155,92,255,0.18),transparent_60%)]" />
              </div>
            )}
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
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LiveDemoButton project={featured} />
                {featured.link && (
                  <Button href={featured.link} variant="ghost">
                    View Details →
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {rest.length > 0 && (
          <div data-testid="secondary-projects-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project) => (
              <GlassCard key={project.id} className="flex flex-col">
                <h4 className="text-lg font-semibold text-[var(--text-primary)]">{project.name}</h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{project.description}</p>
                {project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {demoUrlOf(project) && (
                  <div className="mt-auto pt-5">
                    <LiveDemoButton project={project} />
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
