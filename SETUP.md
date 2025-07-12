# JWT Authentication Setup Guide

This guide will help you set up the JWT-based authentication system for whisprmail.

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (Database only)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Supabase Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to your project's SQL Editor
3. **Choose one of the following options:**

### Option A: Simple Setup (Recommended)
Copy and paste the contents of `database-schema-simple.sql` into the editor. This disables RLS for authentication tables since we're using JWT authentication.

### Option B: Advanced Setup with RLS
Copy and paste the contents of `database-schema.sql` into the editor. This includes Row Level Security policies.

4. Run the SQL to create the necessary tables and policies

## 3. Environment Variables Setup

1. Go to your Supabase project settings
2. Copy the Project URL and anon/public key
3. Update your `.env.local` file with these values
4. Generate a strong JWT secret (you can use a password generator or run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

## 4. Testing the Setup

1. Start your development server: `npm run dev`
2. Visit http://localhost:3000
3. Try creating a new account at `/auth/signup`
4. Try logging in at `/auth/login`
5. Verify that you're redirected to `/dashboard` after successful authentication

## 5. Security Notes

- Change the JWT_SECRET in production
- Use HTTPS in production
- Consider implementing rate limiting
- Regularly rotate JWT secrets
- Monitor for suspicious activity

## 6. Database Tables

The system uses three main tables:

- **users**: Stores user account information
- **sessions**: Stores refresh tokens for session management
- **messages**: Stores anonymous messages (for future use)

## 7. API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify authentication status

## 8. Features

- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Refresh token rotation
- ✅ HTTP-only cookies for security
- ✅ Middleware route protection
- ✅ User session management
- ✅ Database integration with Supabase
- ✅ Maintains existing UI styling

## 9. Troubleshooting

If you encounter issues:

1. Check that all environment variables are set correctly
2. Verify the database tables were created successfully
3. Check the browser console and server logs for errors
4. Ensure your Supabase project is active and accessible
5. Verify that the JWT_SECRET is properly set

### Common Issues:

**RLS Policy Error**: If you see "new row violates row-level security policy", use the simple schema (`database-schema-simple.sql`) which disables RLS for authentication tables.

**Database Connection Error**: Verify your Supabase credentials in `.env.local`

**JWT Errors**: Ensure JWT_SECRET is set and is a strong secret

## 10. Production Deployment

For production deployment:

1. Set up a production Supabase project
2. Update environment variables with production values
3. Generate a strong JWT_SECRET
4. Set NEXT_PUBLIC_SITE_URL to your production domain
5. Enable HTTPS
6. Consider implementing additional security measures 