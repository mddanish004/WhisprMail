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

-- Add a policy to allow users to view messages sent to them
-- This is already covered by the "Users can view their own messages" policy
-- but we need to ensure the user_id in the JWT matches the user_id in the messages table

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