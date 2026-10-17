import { LoginForm } from '@/components/admin/LoginForm'
import { Logo } from '@/components/ui/Logo'
import { adminCard } from '@/components/admin/ui'

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className={`${adminCard} w-full max-w-sm p-8`}>
        <div className="mb-8 flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
          <Logo className="h-8 w-8" />
          Axonvia <span className="text-sm font-normal text-[var(--text-muted)]">Admin</span>
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Sign in</h1>
        <p className="mb-6 mt-1 text-sm text-[var(--text-secondary)]">For Axonvia team members only.</p>
        <LoginForm />
      </div>
    </main>
  )
}
