-- Temporary fix to allow Google OAuth to work
-- Run this in your Supabase SQL editor

-- Drop the constraint temporarily
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS check_auth_method;

-- Add new columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Make password nullable
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;

-- Create index for google_id
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id); 