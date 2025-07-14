import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(req) {
  const accessToken = req.cookies.get('access_token')?.value
  const verifiedToken = accessToken ? await verifyToken(accessToken) : null
  const isAuthenticated = !!verifiedToken

  console.log('Middleware - Path:', req.nextUrl.pathname, 'Authenticated:', !!isAuthenticated, 'Token:', accessToken ? 'Present' : 'Missing')

  if (isAuthenticated && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isAuthenticated && req.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!isAuthenticated && req.nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!isAuthenticated && req.nextUrl.pathname === '/settings') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isAuthenticated && (req.nextUrl.pathname.startsWith('/auth/'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard', '/profile', '/settings', '/auth/:path*']
} 