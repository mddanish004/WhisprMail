import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { username, content } = await request.json();

    if (!username || !content) {
      return NextResponse.json(
        { error: 'Username and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Message content cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    // First, find the user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Insert the anonymous message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        content: content.trim(),
        is_anonymous: true,
        status: 'active'
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error inserting message:', messageError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 