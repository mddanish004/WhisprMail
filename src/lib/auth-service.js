import { supabase, TABLES } from './supabase'
import { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken } from './jwt'
import { hashPassword, comparePassword } from './password-utils'

export class AuthService {
  static async register({ email, password, username }) {
    try {
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      const { data: existingUsername } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('username', username)
        .single()

      if (existingUsername) {
        return { success: false, error: 'Username is already taken' }
      }

      const hashedPassword = await hashPassword(password)

      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          email,
          password: hashedPassword,
          username,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Registration error:', error)
        return { success: false, error: 'Failed to create user' }
      }

      const accessToken = await generateToken({ 
        userId: user.id, 
        email: user.email, 
        username: user.username 
      })
      const refreshToken = await generateRefreshToken(user.id)

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
      console.error('Registration service error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }

  static async login({ email, password }) {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid credentials' }
      }

      const isValidPassword = await comparePassword(password, user.password)
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' }
      }

      const accessToken = await generateToken({ 
        userId: user.id, 
        email: user.email, 
        username: user.username 
      })
      const refreshToken = await generateRefreshToken(user.id)

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
      console.error('Login service error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  static async logout(refreshToken) {
    try {
      if (refreshToken) {
        await supabase
          .from(TABLES.SESSIONS)
          .delete()
          .eq('refresh_token', refreshToken)
      }
      return { success: true }
    } catch (error) {
      console.error('Logout service error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = await verifyRefreshToken(refreshToken)
      if (!decoded) {
        return { success: false, error: 'Invalid refresh token' }
      }

      const { data: session } = await supabase
        .from(TABLES.SESSIONS)
        .select('*')
        .eq('refresh_token', refreshToken)
        .eq('user_id', decoded.userId)
        .single()

      if (!session) {
        return { success: false, error: 'Invalid refresh token' }
      }

      if (new Date(session.expires_at) < new Date()) {
        await supabase
          .from(TABLES.SESSIONS)
          .delete()
          .eq('refresh_token', refreshToken)
        return { success: false, error: 'Refresh token expired' }
      }

      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', decoded.userId)
        .single()

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      const newAccessToken = await generateToken({ 
        userId: user.id, 
        email: user.email, 
        username: user.username 
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          user_metadata: { username: user.username }
        },
        accessToken: newAccessToken
      }
    } catch (error) {
      console.error('Refresh token service error:', error)
      return { success: false, error: 'Token refresh failed' }
    }
  }

  static async getUserById(userId) {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('id, email, username, full_name, avatar_url, created_at')
        .eq('id', userId)
        .single()

      if (error || !user) {
        return { success: false, error: 'User not found' }
      }

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
        }
      }
    } catch (error) {
      console.error('Get user service error:', error)
      return { success: false, error: 'Failed to get user' }
    }
  }

  static async verifyAccessToken(token) {
    try {
      const decoded = await verifyToken(token)
      if (!decoded) {
        return { success: false, error: 'Invalid token' }
      }

      const result = await this.getUserById(decoded.userId)
      if (!result.success) {
        return { success: false, error: 'User not found' }
      }

      return {
        success: true,
        user: result.user
      }
    } catch (error) {
      console.error('Verify token service error:', error)
      return { success: false, error: 'Token verification failed' }
    }
  }

  static async updateUsername({ userId, newUsername }) {
    try {
      const { data: existingUsername } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('username', newUsername)
        .single();
      if (existingUsername) {
        return { success: false, error: 'Username is already taken' };
      }
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .update({ username: newUsername })
        .eq('id', userId)
        .select()
        .single();
      if (error) {
        return { success: false, error: 'Failed to update username' };
      }
      return { success: true, user };
    } catch (error) {
      console.error('Update username service error:', error);
      return { success: false, error: 'Failed to update username' };
    }
  }

  static async changePassword({ userId, currentPassword, newPassword }) {
    try {
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();
      if (userError || !user) {
        return { success: false, error: 'User not found' };
      }
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' };
      }
      const hashedPassword = await hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from(TABLES.USERS)
        .update({ password: hashedPassword })
        .eq('id', userId);
      if (updateError) {
        return { success: false, error: 'Failed to update password' };
      }
      return { success: true };
    } catch (error) {
      console.error('Change password service error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  static async deleteAccount({ userId }) {
    try {
      await supabase.from(TABLES.MESSAGES).delete().eq('user_id', userId);
      await supabase.from(TABLES.SESSIONS).delete().eq('user_id', userId);
      const { error } = await supabase.from(TABLES.USERS).delete().eq('id', userId);
      if (error) {
        return { success: false, error: 'Failed to delete user' };
      }
      return { success: true };
    } catch (error) {
      console.error('Delete account service error:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  }
} 