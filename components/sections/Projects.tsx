import { ExternalLink } from 'lucide-react'
import { getPublishedProjects } from '@/lib/queries/content'
import { showcaseProjects, type ShowcaseProject } from '@/lib/showcase-projects'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { ParallaxImage } from '@/components/motion/ParallaxImage'
import type { Project } from '@/lib/types'

type DisplayProject = Project | ShowcaseProject

function isShowcase(project: DisplayProject): project is ShowcaseProject {
  return 'demoUrl' in project
}

// External demo link: opens in a new tab, and says so to screen readers.
function LiveDemoButton({ project, variant = 'primary' }: { project: ShowcaseProject; variant?: 'primary' | 'secondary' }) {
  return (
    <a
      href={project.demoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Live Demo: ${project.name} (opens in a new tab)`}
      className={buttonClasses(variant, 'default', 'gap-2')}
    >
      Live Demo
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
    </a>
  )
}

function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text-muted)]" aria-label="Built with">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

function hostOf(url: string) {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

// A thin browser frame with the real address, so the screenshot reads as a live site rather than a mock-up.
function Screenshot({ project }: { project: DisplayProject }) {
  const image = isShowcase(project)
    ? project.image
    : project.imageUrl
      ? { src: project.imageUrl, alt: project.name, width: undefined, height: undefined }
      : null
  if (!image) return null

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--bg-card)] shadow-[var(--shadow-raised)]">
      {isShowcase(project) && (
        <div className="border-b border-[var(--rule)] px-4 py-2.5 text-center font-mono text-xs text-[var(--text-muted)]">
          {hostOf(project.demoUrl)}
        </div>
      )}
      <ParallaxImage src={image.src} alt={image.alt} width={image.width} height={image.height} />
    </div>
  )
}

export async function Projects() {
  // Showcase projects lead (the Todo App is the featured project); admin-managed projects follow in the grid.
  const projects: DisplayProject[] = [...showcaseProjects, ...(await getPublishedProjects())]
  const featured = projects.find((project) => project.isFeatured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  return (
    <Section id="projects" wash labelledBy="projects-title">
      <SectionHeader
        id="projects-title"
        title="Systems we’ve built"
        subtitle="Live work you can open and try, not mock-ups."
      />

      {!featured && (
        <div className="mt-16 max-w-xl border-t border-[var(--rule-strong)] pt-8">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Case studies in progress</h3>
          <p className="mt-3 text-[var(--text-secondary)]">
            We&apos;re writing up recent builds with the detail they deserve. In the meantime, we&apos;re happy to walk
            you through our approach on a call.
          </p>
          <Button href="#final-cta" variant="secondary" className="mt-6">
            Discuss your project
          </Button>
        </div>
      )}

      {featured && (
        <article className="mt-16 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-7">
            <Screenshot project={featured} />
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[var(--accent-cyan)]">Featured project</p>
            <h3 className="mt-3 text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">{featured.name}</h3>
            <p className="mt-4 text-[var(--text-secondary)]">{featured.description}</p>
            {featured.stats.length > 0 && (
              <ul className="mt-6 border-t border-[var(--rule)]">
                {featured.stats.map((stat) => (
                  <li key={stat} className="border-b border-[var(--rule)] py-2.5 text-[0.9375rem] text-[var(--text-primary)]">
                    {stat}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Tags tags={featured.tags} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {isShowcase(featured) && <LiveDemoButton project={featured} />}
              {featured.link && (
                <Button href={featured.link} variant="ghost">
                  View details
                </Button>
              )}
            </div>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <div data-testid="secondary-projects-grid" className="mt-20 grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {rest.map((project) => (
            <article key={project.id} className="flex flex-col border-t border-[var(--rule-strong)] pt-8">
              {!isShowcase(project) && project.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-lg border border-[var(--rule)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host. */}
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[16/10] w-full object-cover"
                  />
                </div>
              )}
              <h4 className="text-xl font-semibold text-[var(--text-primary)]">{project.name}</h4>
              <p className="mt-2 text-[var(--text-secondary)]">{project.description}</p>
              <div className="mt-4">
                <Tags tags={project.tags} />
              </div>
              {isShowcase(project) && (
                <div className="mt-auto pt-6">
                  <LiveDemoButton project={project} variant="secondary" />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
