'use server'

import { redirect } from 'next/navigation'

export async function handleSignUp(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const username = formData.get('username')

  if (!email || !password || !username) {
    return { error: 'All fields are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long' }
  }

  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters long' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: 'Username can only contain letters, numbers, and underscores' }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return { error: data.error || 'Something went wrong' }
    }

    redirect('/dashboard')
  } catch (error) {
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('Signup action error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function handleSignIn(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return { error: data.error || 'Invalid credentials' }
    }

    redirect('/dashboard')
  } catch (error) {
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function handleSignOut() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/signout`, {
      method: 'POST',
    })

    if (!response.ok) {
      return { error: 'Failed to sign out' }
    }

    redirect('/')
  } catch (error) {
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    return { error: 'Something went wrong. Please try again.' }
  }
} 