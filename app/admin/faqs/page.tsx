import { PageHeader } from '@/components/admin/ui'
import { listFaqsForAdmin } from '@/app/actions/faqs'
import { FaqsAdminClient } from '@/components/admin/FaqsAdminClient'

export default async function AdminFaqsPage() {
  const faqs = await listFaqsForAdmin()

  return (
    <>
      <PageHeader title="FAQs" description="Questions shown in the FAQ section." />
      <FaqsAdminClient faqs={faqs} />
    </>
  )
}
