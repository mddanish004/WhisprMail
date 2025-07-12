# Anonymous Messaging Functionality

## Overview

The anonymous messaging functionality allows users to send anonymous messages to other users using their unique public link. This feature is fully implemented end-to-end with the following components:

## Features

### 1. Public Message Page (`/u/[username]`)
- **Location**: `src/app/u/[username]/page.js`
- **Functionality**: 
  - Displays a form for sending anonymous messages
  - Character limit of 500 characters
  - Real-time character counter
  - Form validation and error handling
  - Success/error feedback
  - Loading states during submission

### 2. API Endpoints

#### Send Message API (`/api/messages/send`)
- **Method**: POST
- **Functionality**: 
  - Accepts anonymous messages
  - Validates username exists
  - Stores message in database
  - Returns success/error response

#### Get Messages API (`/api/messages`)
- **Method**: GET
- **Functionality**: 
  - Fetches messages for authenticated user
  - Requires JWT authentication
  - Returns messages ordered by creation date

#### Update Message API (`/api/messages/[id]`)
- **Method**: PATCH
- **Functionality**: 
  - Updates message status (active/archived/deleted)
  - Requires authentication
  - Validates user ownership

#### Delete Message API (`/api/messages/[id]`)
- **Method**: DELETE
- **Functionality**: 
  - Permanently deletes a message
  - Requires authentication
  - Validates user ownership

### 3. Dashboard Integration
- **Location**: `src/app/dashboard/page.js`
- **Functionality**:
  - Displays real messages from database
  - Message management (archive/restore/delete)
  - Real-time statistics
  - Loading states
  - Error handling

## Database Schema

### Messages Table
```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS Policies
- Public access for message insertion (anonymous messaging)
- Users can only view/update/delete their own messages
- Proper security with Row Level Security enabled

## Setup Instructions

### 1. Database Migration
Run the following SQL in your Supabase SQL editor:

```sql
-- Run the main schema
-- database-schema.sql

-- Run the anonymous messaging migration
-- database-migration-anonymous-messaging.sql
```

### 2. Environment Variables
Ensure the following environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `JWT_SECRET`

### 3. Testing the Functionality

1. **Create a user account** through the signup process
2. **Get your public link** from the dashboard
3. **Share the link** with others or test it yourself
4. **Send anonymous messages** using the public link
5. **View and manage messages** in the dashboard

## Security Features

- **JWT Authentication**: All user-specific operations require valid JWT tokens
- **Row Level Security**: Database-level security preventing unauthorized access
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Ready for implementation (can be added via middleware)
- **reCAPTCHA**: Placeholder ready for integration

## Error Handling

- **Client-side**: Form validation, loading states, user feedback
- **Server-side**: Proper error responses, logging, database error handling
- **Network**: Graceful handling of network failures

## Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Client-side State**: Efficient state management with React hooks
- **Lazy Loading**: Ready for implementation of pagination
- **Caching**: Can be implemented for frequently accessed data

## Future Enhancements

1. **Rate Limiting**: Implement rate limiting for message sending
2. **reCAPTCHA Integration**: Add Google reCAPTCHA for spam prevention
3. **Message Filtering**: Add content filtering and moderation
4. **Notifications**: Real-time notifications for new messages
5. **Message Categories**: Organize messages by categories
6. **Export Functionality**: Allow users to export their messages
7. **Analytics**: Message analytics and insights

## API Documentation

### Send Message
```javascript
POST /api/messages/send
Content-Type: application/json

{
  "username": "target_username",
  "content": "Your anonymous message here"
}
```

### Get Messages
```javascript
GET /api/messages
Authorization: Bearer <jwt_token>
```

### Update Message Status
```javascript
PATCH /api/messages/[id]
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "archived" // or "active", "deleted"
}
```

### Delete Message
```javascript
DELETE /api/messages/[id]
Authorization: Bearer <jwt_token>
```

## Troubleshooting

### Common Issues

1. **"User not found" error**: Ensure the username exists in the database
2. **Authentication errors**: Check JWT token validity and storage
3. **Database connection issues**: Verify Supabase configuration
4. **CORS issues**: Ensure proper CORS configuration for API routes

### Debug Steps

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify database connection and schema
4. Test API endpoints directly with tools like Postman
5. Verify environment variables are properly set 