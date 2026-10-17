import { PageHeader } from '@/components/admin/ui'
import { listTestimonialsForAdmin } from '@/app/actions/testimonials'
import { TestimonialsAdminClient } from '@/components/admin/TestimonialsAdminClient'

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsForAdmin()

  return (
    <>
      <PageHeader title="Testimonials" description="Client quotes. The section shows the early-stage message until one is published." />
      <TestimonialsAdminClient testimonials={testimonials} />
    </>
  )
}
