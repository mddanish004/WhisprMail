import { supabase, TABLES } from './supabase'
import { generateToken, verifyToken, hashPassword, comparePassword, generateRefreshToken, verifyRefreshToken } from './jwt'

export class AuthService {
  // Register new user
  static async register({ email, password, username }) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Check if username is taken
      const { data: existingUsername } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('username', username)
        .single()

      if (existingUsername) {
        return { success: false, error: 'Username is already taken' }
      }

      // Hash password
      const hashedPassword = await hashPassword(password)

      // Create user
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
      console.error('Registration service error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }

  // Login user
  static async login({ email, password }) {
    try {
      // Find user by email
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password)
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' }
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
      console.error('Login service error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  // Logout user
  static async logout(refreshToken) {
    try {
      if (refreshToken) {
        // Remove refresh token from database
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

  // Refresh access token
  static async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = await verifyRefreshToken(refreshToken)
      if (!decoded) {
        return { success: false, error: 'Invalid refresh token' }
      }

      // Check if refresh token exists in database
      const { data: session } = await supabase
        .from(TABLES.SESSIONS)
        .select('*')
        .eq('refresh_token', refreshToken)
        .eq('user_id', decoded.userId)
        .single()

      if (!session) {
        return { success: false, error: 'Invalid refresh token' }
      }

      // Check if token is expired
      if (new Date(session.expires_at) < new Date()) {
        // Remove expired token
        await supabase
          .from(TABLES.SESSIONS)
          .delete()
          .eq('refresh_token', refreshToken)
        return { success: false, error: 'Refresh token expired' }
      }

      // Get user data
      const { data: user } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', decoded.userId)
        .single()

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Generate new access token
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

  // Get user by ID
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

  // Verify access token
  static async verifyAccessToken(token) {
    try {
      const decoded = await verifyToken(token)
      if (!decoded) {
        return { success: false, error: 'Invalid token' }
      }

      // Get user data
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

  // Update username
  static async updateUsername({ userId, newUsername }) {
    try {
      // Check if username is taken
      const { data: existingUsername } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('username', newUsername)
        .single();
      if (existingUsername) {
        return { success: false, error: 'Username is already taken' };
      }
      // Update username
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

  // Change password
  static async changePassword({ userId, currentPassword, newPassword }) {
    try {
      // Get user
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();
      if (userError || !user) {
        return { success: false, error: 'User not found' };
      }
      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' };
      }
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      // Update password
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

  // Delete account
  static async deleteAccount({ userId }) {
    try {
      // Delete messages
      await supabase.from(TABLES.MESSAGES).delete().eq('user_id', userId);
      // Delete sessions
      await supabase.from(TABLES.SESSIONS).delete().eq('user_id', userId);
      // Delete user
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