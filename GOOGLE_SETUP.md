# Google OAuth Setup Guide

## 1. Database Migration

First, run the migration script in your Supabase SQL editor:

```sql
-- Migration script to add Google OAuth support to existing database
-- Run this in your Supabase SQL editor

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Make password nullable for Google OAuth users
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;

-- Add constraint to ensure either password or google_id is present
ALTER TABLE users 
ADD CONSTRAINT check_auth_method CHECK (
  (password IS NOT NULL) OR (google_id IS NOT NULL)
);

-- Create index for google_id
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

## 2. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## 3. Test the Implementation

After completing the setup:

1. Restart your development server
2. Go to `/auth/signup` or `/auth/login`
3. Click "Continue with Google"
4. Complete the OAuth flow

The Google authentication should now work without errors! 