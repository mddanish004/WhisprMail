import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function POST(request) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Refresh access token
    const result = await AuthService.refreshAccessToken(refreshToken)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Create response with new access token
    const response = NextResponse.json({
      success: true,
      user: result.user
    })

    // Set new access token cookie
    response.cookies.set('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Refresh token API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 