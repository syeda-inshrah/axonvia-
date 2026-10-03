import { listTestimonialsForAdmin } from '@/app/actions/testimonials'
import { TestimonialsAdminClient } from '@/components/admin/TestimonialsAdminClient'

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsForAdmin()

  return (
    <main>
      <h1>Testimonials</h1>
      <TestimonialsAdminClient testimonials={testimonials} />
    </main>
  )
}
