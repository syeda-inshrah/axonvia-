import { listFaqsForAdmin } from '@/app/actions/faqs'
import { FaqsAdminClient } from '@/components/admin/FaqsAdminClient'

export default async function AdminFaqsPage() {
  const faqs = await listFaqsForAdmin()

  return (
    <main>
      <h1>FAQs</h1>
      <FaqsAdminClient faqs={faqs} />
    </main>
  )
}
