import * as jose from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

const secret = new TextEncoder().encode(JWT_SECRET)

export async function generateToken(payload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    console.log('JWT verification successful:', { userId: payload.userId, email: payload.email })
    return payload
  } catch (error) {
    console.log('JWT verification failed:', error.message)
    return null
  }
}

export async function hashPassword(password) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export async function generateRefreshToken(userId) {
  return await new jose.SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)
}

export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    if (payload.type !== 'refresh') {
      return null
    }
    return payload
  } catch (error) {
    return null
  }
} 