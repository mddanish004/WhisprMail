'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const signUp = async (email, password, username) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        if (data.accessToken) {
          document.cookie = `access_token=${data.accessToken}; path=/; max-age=604800;`;
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Something went wrong' }
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        if (data.accessToken) {
          document.cookie = `access_token=${data.accessToken}; path=/; max-age=604800;`;
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Signin error:', error)
      return { success: false, error: 'Something went wrong' }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google')
      const data = await response.json()

      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to initiate Google sign in' }
      }
    } catch (error) {
      console.error('Google signin error:', error)
      return { success: false, error: 'Something went wrong' }
    }
  }

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        setUser(null)
        router.push('/')
      }
    } catch (error) {
      console.error('Signout error:', error)
    }
  }

  const refreshAuth = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true }
      } else {
        setUser(null)
        return { success: false }
      }
    } catch (error) {
      console.error('Refresh auth error:', error)
      setUser(null)
      return { success: false }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true }
      } else {
        setUser(null)
        return { success: false }
      }
    } catch (error) {
      setUser(null)
      return { success: false }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAuth,
    checkAuth,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 