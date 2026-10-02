import { db } from '@/lib/db'
import { projects, testimonials, faqs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import type { Project, Testimonial, Faq } from '@/lib/types'

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    return (await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'live'))
      .orderBy(asc(projects.sortOrder))) as Project[]
  } catch (error) {
    console.error('getPublishedProjects failed:', error)
    return []
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    return (await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder))) as Testimonial[]
  } catch (error) {
    console.error('getPublishedTestimonials failed:', error)
    return []
  }
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  try {
    return (await db
      .select()
      .from(faqs)
      .where(eq(faqs.isPublished, true))
      .orderBy(asc(faqs.sortOrder))) as Faq[]
  } catch (error) {
    console.error('getPublishedFaqs failed:', error)
    return []
  }
}
