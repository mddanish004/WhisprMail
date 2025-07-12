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