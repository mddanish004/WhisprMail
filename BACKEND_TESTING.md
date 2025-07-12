# Backend Testing Guide

This guide will help you test all the JWT authentication endpoints and functionality.

## Prerequisites

1. Make sure your `.env.local` file is properly configured:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

2. Ensure your Supabase database has the required tables (run `database-schema.sql`)

3. Start the development server: `npm run dev`

## Testing the API Endpoints

### 1. Test User Registration (Signup)

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser",
    "user_metadata": {
      "username": "testuser"
    }
  },
  "message": "Account created successfully!"
}
```

### 2. Test User Login (Signin)

```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser",
    "user_metadata": {
      "username": "testuser"
    }
  }
}
```

### 3. Test Authentication Verification

```bash
curl -X GET http://localhost:3001/api/auth/verify \
  -H "Cookie: access_token=YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser",
    "user_metadata": {
      "username": "testuser"
    }
  }
}
```

### 4. Test Token Refresh

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Cookie: refresh_token=YOUR_REFRESH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser",
    "user_metadata": {
      "username": "testuser"
    }
  }
}
```

### 5. Test User Logout

```bash
curl -X POST http://localhost:3001/api/auth/signout \
  -H "Cookie: refresh_token=YOUR_REFRESH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true
}
```

## Testing with Browser

### 1. Manual Testing Steps

1. **Open your browser** and go to `http://localhost:3001`

2. **Test Registration:**
   - Navigate to `/auth/signup`
   - Fill in the form with test data
   - Submit and verify you're redirected to `/dashboard`

3. **Test Login:**
   - Navigate to `/auth/login`
   - Use the credentials you just created
   - Verify you're redirected to `/dashboard`

4. **Test Dashboard Access:**
   - Try accessing `/dashboard` directly
   - Verify you can see the dashboard content

5. **Test Logout:**
   - Click the profile dropdown
   - Click "Sign Out"
   - Verify you're redirected to the home page

### 2. Browser Developer Tools Testing

1. **Open Developer Tools** (F12)

2. **Check Network Tab:**
   - Monitor API calls during signup/login
   - Verify cookies are being set
   - Check response status codes

3. **Check Application Tab:**
   - Verify cookies are stored properly
   - Check for `access_token` and `refresh_token`

## Testing Error Cases

### 1. Invalid Registration

```bash
# Test duplicate email
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser2"
  }'
```

**Expected Response:**
```json
{
  "error": "User with this email already exists"
}
```

### 2. Invalid Login

```bash
# Test wrong password
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```

### 3. Invalid Token Verification

```bash
# Test without token
curl -X GET http://localhost:3001/api/auth/verify
```

**Expected Response:**
```json
{
  "error": "No access token provided"
}
```

## Testing Middleware

### 1. Protected Routes

1. **Without Authentication:**
   - Try accessing `/dashboard` without being logged in
   - Should redirect to home page

2. **With Authentication:**
   - Login first, then try accessing `/dashboard`
   - Should allow access

### 2. Auth Pages Redirect

1. **When Logged In:**
   - Login first, then try accessing `/auth/login`
   - Should redirect to `/dashboard`

## Database Verification

### 1. Check Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Check the `users` table for new registrations
4. Check the `sessions` table for active sessions

### 2. SQL Queries for Testing

```sql
-- Check all users
SELECT * FROM users;

-- Check active sessions
SELECT * FROM sessions WHERE expires_at > NOW();

-- Check user count
SELECT COUNT(*) FROM users;
```

## Common Issues and Solutions

### 1. "Module not found" errors
- Ensure all files are in the correct locations
- Check import paths in middleware.js

### 2. Database connection errors
- Verify Supabase credentials in `.env.local`
- Check if Supabase project is active

### 3. JWT errors
- Ensure JWT_SECRET is set in `.env.local`
- Check token expiration times

### 4. Cookie issues
- Ensure you're testing on localhost
- Check browser cookie settings

## Performance Testing

### 1. Load Testing (Optional)

```bash
# Install Apache Bench if available
ab -n 100 -c 10 http://localhost:3001/api/auth/verify
```

### 2. Memory Usage

Monitor memory usage during testing:
```bash
# Check Node.js memory usage
ps aux | grep node
```

## Security Testing

### 1. Token Validation
- Try using expired tokens
- Try using malformed tokens
- Verify tokens are properly validated

### 2. Password Security
- Test password hashing
- Verify passwords are not stored in plain text

### 3. Cookie Security
- Verify cookies are HTTP-only
- Check cookie expiration times

## Next Steps

After successful testing:

1. **Deploy to production** with proper environment variables
2. **Set up monitoring** for API endpoints
3. **Implement rate limiting** for security
4. **Add logging** for debugging
5. **Set up automated tests** for CI/CD

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all environment variables are set
4. Ensure database tables are created
5. Test with different browsers/devices 