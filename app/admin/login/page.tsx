import { signInAction } from '@/app/actions/auth'

export default function AdminLoginPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    await signInAction(formData)
  }

  return (
    <main>
      <h1>Admin login</h1>
      <form action={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}
