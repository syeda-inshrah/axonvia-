import bcrypt from 'bcryptjs'
import { adminUsers } from '@/lib/db/schema'
import { validateNewAdmin } from '@/lib/admin-account'

type Insertable = {
  insert: (table: typeof adminUsers) => {
    values: (row: typeof adminUsers.$inferInsert) => { onConflictDoNothing: () => { returning: () => Promise<unknown[]> } }
  }
}

/**
 * Creates the admin named by ADMIN_EMAIL / ADMIN_PASSWORD if that email has no account yet; an existing
 * account (and its password) is never changed. Returns a line for the build log, which never includes the password.
 */
export async function bootstrapAdmin(db: Insertable, env: { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string }) {
  const email = env.ADMIN_EMAIL?.trim()
  const password = env.ADMIN_PASSWORD
  if (!email || !password) return 'admin bootstrap: ADMIN_EMAIL / ADMIN_PASSWORD not set; skipped.'

  const problem = validateNewAdmin(email, password)
  if (problem) return `admin bootstrap: not created: ${problem}`

  const created = await db
    .insert(adminUsers)
    .values({ email, passwordHash: await bcrypt.hash(password, 12) })
    .onConflictDoNothing()
    .returning()
  return created.length
    ? `admin bootstrap: created admin ${email}. You can now remove ADMIN_PASSWORD from Vercel.`
    : `admin bootstrap: ${email} already exists; left unchanged.`
}
