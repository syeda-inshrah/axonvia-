import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'

async function main() {
  const [email, password] = process.argv.slice(2)
  if (!email || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(adminUsers).values({ email, passwordHash })
  console.log(`Admin user created: ${email}`)
}

main()
