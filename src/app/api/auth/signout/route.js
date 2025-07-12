import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function POST(request) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value

    // Logout user
    if (refreshToken) {
      await AuthService.logout(refreshToken)
    }

    // Create response
    const response = NextResponse.json({ success: true })

    // Clear cookies
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Signout API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 