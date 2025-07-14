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
    const { newUsername } = await request.json();
    if (!newUsername || newUsername.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters long' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
    }
    const result = await AuthService.updateUsername({ userId, newUsername });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    console.error('Update username API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 