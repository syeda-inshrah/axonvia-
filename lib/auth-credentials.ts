import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// bcrypt hash of random bytes: compared against when no admin matches, so a wrong email takes as long as a
// wrong password and response time can't be used to discover admin addresses.
const NO_USER_HASH = '$2b$10$oIMkKHCed1I0CCDGSkx4ROMgDsJA7zBz675Go0ZdE4RZshRQKV9Qy'

export async function verifyAdminCredentials(email: string, password: string) {
  // Case- and space-insensitive: browsers and phones often capitalise or pad a typed email.
  const normalized = email.trim().toLowerCase()
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(sql`lower(${adminUsers.email}) = ${normalized}`)
    .limit(1)
  if (!user) {
    await bcrypt.compare(password, NO_USER_HASH)
    return null
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return { id: user.id, email: user.email }
}
