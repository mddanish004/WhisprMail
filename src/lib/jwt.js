import * as jose from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET)

// Generate JWT token
export async function generateToken(payload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

// Verify JWT token
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

// Hash password
export async function hashPassword(password) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Compare password
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Generate refresh token
export async function generateRefreshToken(userId) {
  return await new jose.SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)
}

// Verify refresh token
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