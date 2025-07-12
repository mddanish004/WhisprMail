import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth-service'

export async function GET(request) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    // Verify access token
    const result = await AuthService.verifyAccessToken(accessToken)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user
    })
  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 