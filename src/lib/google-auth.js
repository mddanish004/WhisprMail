import { supabase, TABLES } from './supabase'
import { generateToken, generateRefreshToken } from './jwt'

// Google OAuth configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
}

// Generate Google OAuth URL
export function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  })
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: GOOGLE_CONFIG.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_CONFIG.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    return await response.json()
  } catch (error) {
    console.error('Token exchange error:', error)
    throw error
  }
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user info')
    }

    return await response.json()
  } catch (error) {
    console.error('Get user info error:', error)
    throw error
  }
}

// Handle Google authentication
export async function handleGoogleAuth(googleUser) {
  try {
    console.log('Google user data:', googleUser)
    const { email, name, picture, id: googleId } = googleUser

    // Use id as googleId, fallback to sub if available
    const finalGoogleId = googleId || googleUser.sub || googleUser.id

    // Validate required fields
    if (!email || !finalGoogleId) {
      console.error('Missing required fields:', { email, finalGoogleId, googleUser })
      throw new Error('Missing required Google user information')
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single()

    let user

    if (existingUser) {
      // User exists, update Google ID if not set
      if (!existingUser.google_id) {
        await supabase
          .from(TABLES.USERS)
          .update({ google_id: finalGoogleId })
          .eq('id', existingUser.id)
      }
      user = existingUser
    } else {
      // Create new user
      const username = generateUsernameFromEmail(email)
      
      const { data: newUser, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          email,
          username,
          google_id: finalGoogleId,
          full_name: name || null,
          avatar_url: picture || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Create user error:', error)
        throw new Error('Failed to create user')
      }

      user = newUser
    }

    // Generate tokens
    const accessToken = await generateToken({ 
      userId: user.id, 
      email: user.email, 
      username: user.username 
    })
    const refreshToken = await generateRefreshToken(user.id)

    // Store refresh token in database
    await supabase
      .from(TABLES.SESSIONS)
      .insert({
        user_id: user.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        user_metadata: { 
          username: user.username,
          full_name: user.full_name,
          avatar_url: user.avatar_url
        }
      },
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error('Google auth service error:', error)
    return { success: false, error: 'Google authentication failed' }
  }
}

// Generate username from email
function generateUsernameFromEmail(email) {
  const baseUsername = email.split('@')[0]
  const cleanUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, '')
  return cleanUsername || 'user'
} 