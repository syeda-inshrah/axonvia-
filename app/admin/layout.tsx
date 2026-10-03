import Link from 'next/link'
import { SignOutButton } from '@/components/admin/SignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/newsletter">Newsletter</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/testimonials">Testimonials</Link>
        <Link href="/admin/faqs">FAQs</Link>
        <SignOutButton />
      </nav>
      <main>{children}</main>
    </div>
  )
}
