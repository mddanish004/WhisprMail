# Database Migration Guide

## 🗄️ Complete Database Setup for Anonymous Messaging

This guide provides all the necessary SQL scripts to set up your Supabase database for the anonymous messaging functionality.

## 📋 Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **SQL Editor Access**: Navigate to your Supabase dashboard → SQL Editor
3. **Environment Variables**: Ensure your `.env.local` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   ```

## 🚀 Migration Steps

### Step 1: Run Main Schema

Copy and paste the following SQL into your Supabase SQL Editor:

```sql
-- Database schema for whisprmail JWT authentication system
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for refresh tokens
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for future use)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Allow public access for user registration
CREATE POLICY "Allow public user registration" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for sessions table
-- Allow public access for session creation during login
CREATE POLICY "Allow public session creation" ON sessions
  FOR INSERT WITH CHECK (true);

-- Allow users to manage their own sessions
CREATE POLICY "Users can manage their own sessions" ON sessions
  FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for messages table
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
```

### Step 2: Run Anonymous Messaging Migration

After the main schema is created, run this migration:

```sql
-- Migration for anonymous messaging functionality
-- Run this in your Supabase SQL editor

-- Drop existing RLS policies for messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- Create new RLS policies for messages table
-- Allow users to view their own messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow public access for inserting messages (anonymous messaging)
CREATE POLICY "Allow public message insertion" ON messages
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own messages
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" ON messages
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Optional: Add a function to get user ID by username for anonymous messaging
CREATE OR REPLACE FUNCTION get_user_id_by_username(username_param VARCHAR)
RETURNS UUID AS $$
DECLARE
  user_id_result UUID;
BEGIN
  SELECT id INTO user_id_result
  FROM users
  WHERE username = username_param;
  
  RETURN user_id_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_id_by_username(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION get_user_id_by_username(VARCHAR) TO authenticated;
```

## ✅ Verification Steps

After running the migrations, verify the setup:

### 1. Check Tables
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'sessions', 'messages');
```

### 2. Check RLS Policies
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'sessions', 'messages');
```

### 3. Check Indexes
```sql
-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('users', 'sessions', 'messages');
```

## 🧪 Test Data Setup

### Create a Test User
```sql
-- Insert a test user (replace with your desired values)
INSERT INTO users (email, username, password) 
VALUES (
  'test@example.com',
  'testuser',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8sKi' -- password: 'password123'
);
```

### Test Anonymous Message
```sql
-- Test sending an anonymous message
INSERT INTO messages (user_id, content, is_anonymous, status)
SELECT 
  id,
  'This is a test anonymous message!',
  true,
  'active'
FROM users 
WHERE username = 'testuser';
```

## 🔧 Troubleshooting

### Common Issues

1. **"Policy already exists" error**
   - The migration includes `DROP POLICY IF EXISTS` statements
   - This is normal and safe to run multiple times

2. **"Function already exists" error**
   - The `CREATE OR REPLACE FUNCTION` handles this automatically
   - No action needed

3. **RLS not working**
   - Ensure RLS is enabled: `ALTER TABLE messages ENABLE ROW LEVEL SECURITY;`
   - Check policies are created correctly

4. **Permission denied errors**
   - Ensure the `anon` and `authenticated` roles have proper permissions
   - Check the `GRANT` statements in the migration

### Verification Commands

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'sessions', 'messages');

-- Check user permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'messages';
```

## 🚀 Next Steps

After successful migration:

1. **Test the API endpoints** using the test script provided
2. **Create real users** through your application
3. **Test anonymous messaging** with real usernames
4. **Monitor database performance** in Supabase dashboard
5. **Set up backups** and monitoring

## 📊 Database Schema Overview

```
users
├── id (UUID, Primary Key)
├── email (VARCHAR, Unique)
├── username (VARCHAR, Unique)
├── password (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

sessions
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── refresh_token (TEXT, Unique)
├── expires_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

messages
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── content (TEXT)
├── is_anonymous (BOOLEAN)
├── status (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

Your database is now ready for anonymous messaging! 🎉 