import { NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo, handleGoogleAuth } from '@/lib/google-auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=google_auth_failed', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/login?error=no_auth_code', request.url))
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)
    console.log('Tokens received:', { access_token: tokens.access_token ? 'present' : 'missing' })
    
    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token)
    console.log('Google user info received:', googleUser)
    
    // Handle authentication
    const result = await handleGoogleAuth(googleUser)

    if (!result.success) {
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(result.error)}`, request.url))
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Set HTTP-only cookies
    response.cookies.set('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    response.cookies.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=google_auth_failed', request.url))
  }
} 