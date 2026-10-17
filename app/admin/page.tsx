import { redirect } from 'next/navigation'

// Sign-in lands on /admin; the leads inbox is the dashboard's home.
export default function AdminHome() {
  redirect('/admin/leads')
}
