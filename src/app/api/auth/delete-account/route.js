import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { verifyToken } from '@/lib/jwt';

export async function DELETE(request) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyToken(accessToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = decoded.userId;
    const result = await AuthService.deleteAccount({ userId });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    // Clear cookies
    const response = NextResponse.json({ success: true });
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    return response;
  } catch (error) {
    console.error('Delete account API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 