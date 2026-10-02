import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function verifyAdminCredentials(email: string, password: string) {
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return { id: user.id, email: user.email }
}
