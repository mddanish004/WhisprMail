import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
} 