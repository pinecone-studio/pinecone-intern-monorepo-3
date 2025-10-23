# Clerk Authentication Setup for Concert Ticket App

## Overview

This project now uses Clerk for authentication, providing secure sign-in, sign-up, and password reset functionality with 4-digit confirmation codes.

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose "Next.js" as your framework

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory with your Clerk keys:

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/sign-up/success

# Backend Configuration
NEXT_PUBLIC_BACKEND_URI=http://localhost:4200/api/graphql
```

### 3. Configure Clerk Dashboard

1. In your Clerk dashboard, go to "Email, Phone, Username" settings
2. Enable email verification with 4-digit codes
3. Configure your email templates
4. Set up password reset functionality

### 4. Features Implemented

#### Frontend

- ✅ Clerk provider setup with custom styling
- ✅ Sign-in page with Clerk components
- ✅ Sign-up page with Clerk components
- ✅ Forgot password functionality
- ✅ User profile page
- ✅ Navigation bar with authentication status
- ✅ Success pages for sign-up and password reset
- ✅ Middleware for route protection

#### Backend

- ✅ Clerk authentication service
- ✅ Backend context updated to handle Clerk tokens
- ✅ Fallback to legacy JWT authentication
- ✅ Environment configuration for Clerk

### 5. Authentication Flow

1. **Sign Up**: Users can register with email and password
2. **Email Verification**: Clerk sends 4-digit confirmation codes
3. **Sign In**: Users sign in with verified credentials
4. **Password Reset**: Users can reset passwords via email
5. **Profile Management**: Users can view and manage their profile

### 6. Security Features

- JWT token verification on backend
- Route protection with middleware
- Secure password handling
- Email verification with codes
- Session management

### 7. Testing the Integration

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/sign-up` to test registration
3. Check email for verification code
4. Complete sign-up process
5. Test sign-in functionality
6. Test password reset flow

### 8. Customization

The Clerk components are styled to match the app's dark theme. You can further customize the appearance in the component files:

- `SignIn.tsx` - Sign-in page styling
- `SignUp.tsx` - Sign-up page styling
- `ClerkWrapper.tsx` - Global Clerk configuration

### 9. Troubleshooting

- Ensure environment variables are properly set
- Check Clerk dashboard for proper configuration
- Verify email settings for verification codes
- Check browser console for any errors

## Next Steps

The authentication system is now fully integrated with Clerk. Users can:

- Register with email verification
- Sign in securely
- Reset passwords
- Manage their profiles
- Access protected routes

The system maintains backward compatibility with the existing JWT authentication while providing the enhanced security and user experience of Clerk.
