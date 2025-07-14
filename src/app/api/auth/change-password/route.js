import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { verifyToken } from '@/lib/jwt';

export async function PATCH(request) {
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
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }
    const result = await AuthService.changePassword({ userId, currentPassword, newPassword });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 