import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(req) {
  // Get access token from cookies
  const accessToken = req.cookies.get('access_token')?.value
  const verifiedToken = accessToken ? await verifyToken(accessToken) : null
  const isAuthenticated = !!verifiedToken

  console.log('Middleware - Path:', req.nextUrl.pathname, 'Authenticated:', !!isAuthenticated, 'Token:', accessToken ? 'Present' : 'Missing')

  // If user is signed in and the current path is / redirect the user to /dashboard
  if (isAuthenticated && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is not signed in and the current path is /dashboard redirect the user to /
  if (!isAuthenticated && req.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is not signed in and the current path is /profile redirect the user to /
  if (!isAuthenticated && req.nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is not signed in and the current path is /settings redirect the user to /
  if (!isAuthenticated && req.nextUrl.pathname === '/settings') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (req.nextUrl.pathname.startsWith('/auth/'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard', '/profile', '/settings', '/auth/:path*']
} 