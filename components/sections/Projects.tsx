// NOT ON THE HOMEPAGE FOR NOW. This "Systems we've built" section sat between Services and Process in
// app/page.tsx (with id="projects", linked as "Work" from the navbar and footer). It was removed while Axonvia
// focuses on founding clients; the Todo App showcase data and screenshot were deleted with it (see git history).
// To restore: render <Projects /> in app/page.tsx and add { href: '#projects', label: 'Work' } back to the
// navbar and footer links. It lists the projects published as "Live" from Admin → Projects.
import { getPublishedProjects } from '@/lib/queries/content'
import { Section, SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { ShowcaseStage } from '@/components/motion/ShowcaseStage'
import { TiltCard } from '@/components/ui/TiltCard'
import type { Project } from '@/lib/types'

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

function Screenshot({ project }: { project: Project }) {
  if (!project.imageUrl) return null
  return (
    <div className="overflow-hidden rounded-2xl border border-white/80 bg-[var(--bg-card)] shadow-[0_50px_100px_-40px_rgba(30,40,120,0.45)] ring-1 ring-[var(--rule)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host, which next/image would need configured. */}
      <img src={project.imageUrl} alt={project.name} loading="lazy" decoding="async" className="block h-auto w-full" />
    </div>
  )
}

export async function Projects() {
  const projects = await getPublishedProjects()
  const featured = projects.find((project) => project.isFeatured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)

  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeader id="projects-title" title="Systems we’ve built" subtitle="Live work you can open and try, not mock-ups." />

      {!featured && (
        <div className="mt-14 max-w-xl rounded-2xl border border-[var(--rule)] bg-[var(--bg-card)] p-8">
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
        <article className="relative mt-14 md:mt-20">
          {featured.imageUrl && (
            <div className="mx-auto max-w-[1000px]">
              <ShowcaseStage labels={featured.stats}>
                <Screenshot project={featured} />
              </ShowcaseStage>
            </div>
          )}
          <div data-reveal className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-[var(--accent-cyan)]">Featured project</p>
              <h3 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">{featured.name}</h3>
              <p className="mt-5 text-lg text-[var(--text-secondary)]">{featured.description}</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Tags tags={featured.tags} />
              {featured.link && (
                <Button href={featured.link} variant="ghost" className="mt-6">
                  View details
                </Button>
              )}
            </div>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <div data-testid="secondary-projects-grid" className="mx-auto mt-20 grid max-w-[1000px] grid-cols-1 gap-6 md:grid-cols-2">
          {rest.map((project) => (
            <div data-reveal key={project.id} className="h-full">
              <TiltCard className="p-6 sm:p-8">
                {project.imageUrl && (
                  <div className="mb-6 overflow-hidden rounded-xl border border-[var(--rule)]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Plain <img>: admin image URLs can be on any host. */}
                    <img src={project.imageUrl} alt={project.name} loading="lazy" decoding="async" className="block aspect-[16/10] w-full object-cover" />
                  </div>
                )}
                <h4 className="text-xl font-semibold text-[var(--text-primary)]">{project.name}</h4>
                <p className="mt-2 text-[var(--text-secondary)]">{project.description}</p>
                <div className="mt-4">
                  <Tags tags={project.tags} />
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
