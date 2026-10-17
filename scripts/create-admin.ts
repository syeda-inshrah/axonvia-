import { createInterface } from 'readline'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { validateNewAdmin } from '@/lib/admin-account'

// Usage: node --env-file=.env.local node_modules/.bin/tsx scripts/create-admin.ts <email>
// The password is read from ADMIN_PASSWORD or a hidden prompt — never a command argument, which would
// land in shell history.

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    const output = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream }
    output._writeToOutput = (s: string) => {
      if (s.startsWith(question)) output.output.write(question)
    }
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

async function main() {
  const [email, extra] = process.argv.slice(2)
  if (extra !== undefined) {
    console.error('Do not pass the password as an argument. Set ADMIN_PASSWORD or enter it at the prompt.')
    process.exit(1)
  }
  if (!email) {
    console.error('Usage: tsx scripts/create-admin.ts <email>')
    process.exit(1)
  }

  const password = process.env.ADMIN_PASSWORD || (await promptHidden('Password (min 12 characters): '))
  const problem = validateNewAdmin(email, password)
  if (problem) {
    console.error(problem)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  try {
    await db.insert(adminUsers).values({ email: email.trim(), passwordHash })
  } catch (error) {
    console.error('Could not create the admin (does this email already exist?):', error instanceof Error ? error.message : error)
    process.exit(1)
  }
  console.log(`Admin user created: ${email.trim()}`)
}

main()
