import { LoginForm } from '@/components/admin/LoginForm'
import { Logo } from '@/components/ui/Logo'
import { adminCard } from '@/components/admin/ui'
import { Aurora } from '@/components/motion/Aurora'
import { ScrollReveals } from '@/components/motion/ScrollReveals'

export default function AdminLoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--ink-panel)] px-5 py-16">
      <Aurora />
      <div aria-hidden="true" className="dot-grid absolute inset-0" />
      <div data-reveal className={`${adminCard} relative w-full max-w-sm p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]`}>
        <div className="mb-8 flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
          <Logo className="h-8 w-8" />
          Axonvia <span className="text-sm font-normal text-[var(--text-muted)]">Admin</span>
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Sign in</h1>
        <p className="mb-6 mt-1 text-sm text-[var(--text-secondary)]">For Axonvia team members only.</p>
        <LoginForm />
      </div>
      <ScrollReveals />
    </main>
  )
}
