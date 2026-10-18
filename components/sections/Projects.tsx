import { ExternalLink } from 'lucide-react'
import { getPublishedProjects } from '@/lib/queries/content'
import { showcaseProjects, type ShowcaseProject } from '@/lib/showcase-projects'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import type { Project } from '@/lib/types'

type DisplayProject = Project | ShowcaseProject

function isShowcase(project: DisplayProject): project is ShowcaseProject {
  return 'demoUrl' in project
}

// External demo link: opens in a new tab, and says so to screen readers.
function LiveDemoButton({ project, className = '' }: { project: ShowcaseProject; className?: string }) {
  return (
    <a
      href={project.demoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Live Demo: ${project.name} (opens in a new tab)`}
      className={buttonClasses('primary', 'default', `group/demo gap-2 ${className}`)}
    >
      Live Demo
      <ExternalLink
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover/demo:-translate-y-0.5 group-hover/demo:translate-x-0.5"
      />
    </a>
  )
}

function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      {tags.map((tag) => (
        <span key={tag} className="font-mono text-xs text-[var(--text-muted)]">
          {tag}
        </span>
      ))}
    </div>
  )
}

function FeaturedVisual({ project }: { project: DisplayProject }) {
  const image = isShowcase(project)
    ? project.image
    : project.imageUrl
      ? { src: project.imageUrl, alt: project.name, width: undefined, height: undefined }
      : null

  if (!image) {
    // Only reached by an admin project without an image (the showcase projects all have real screenshots).
    return (
      <div
        data-placeholder-visual
        aria-hidden="true"
        className="relative min-h-[220px] overflow-hidden rounded-xl bg-[var(--bg-card)] grid-texture"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,255,0.18),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(155,92,255,0.18),transparent_60%)]" />
      </div>
    )
  }

  return (
    // Browser-chrome frame keeps a light-themed screenshot at home on the dark card.
    <div className="overflow-hidden rounded-xl border border-[var(--border-glass)] bg-[var(--bg-card)] shadow-[0_20px_60px_-20px_rgba(45,212,255,0.25)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--border-glass)] px-3 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
      </div>
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host, which next/image would need configured. */}
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </div>
    </div>
  )
}

export async function Projects() {
  // Showcase projects lead (the Todo App is the featured card); admin-managed projects follow in the grid.
  const projects: DisplayProject[] = [...showcaseProjects, ...(await getPublishedProjects())]
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
          <Reveal className="group">
            <GlassCard className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 lg:gap-10">
              <FeaturedVisual project={featured} />
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">Featured Project</span>
                <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">{featured.name}</h3>
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
                <Tags tags={featured.tags} />
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {isShowcase(featured) && <LiveDemoButton project={featured} />}
                  {featured.link && (
                    <Button href={featured.link} variant="ghost">
                      View Details →
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        )}

        {rest.length > 0 && (
          <Stagger data-testid="secondary-projects-grid" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project) => (
              <StaggerItem key={project.id} className="group h-full">
                <GlassCard className="flex h-full flex-col">
                  {!isShowcase(project) && project.imageUrl && (
                    <div className="mb-5 overflow-hidden rounded-xl border border-[var(--border-glass)]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host. */}
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">{project.name}</h4>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{project.description}</p>
                  <Tags tags={project.tags} />
                  {isShowcase(project) && (
                    <div className="mt-auto pt-5">
                      <LiveDemoButton project={project} />
                    </div>
                  )}
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}
