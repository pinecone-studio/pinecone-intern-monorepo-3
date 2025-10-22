#!/bin/bash

# Clerk Environment Setup Script
echo "🔐 Setting up Clerk Authentication Environment Variables"
echo "=================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Clerk Configuration
# Get these keys from https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/sign-up/success

# Backend Configuration
NEXT_PUBLIC_BACKEND_URI=http://localhost:4200/api/graphql
EOF
    echo "✅ Created .env.local file"
else
    echo "⚠️  .env.local already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://dashboard.clerk.com/last-active?path=api-keys"
echo "2. Create a new application if you haven't already"
echo "3. Copy your publishable key and secret key"
echo "4. Replace the placeholder values in .env.local"
echo "5. Restart your development server"
echo ""
echo "🔧 Example keys format:"
echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51Abc123..."
echo "   CLERK_SECRET_KEY=sk_test_51Abc123..."
echo ""
echo "✨ Once configured, your app will have:"
echo "   - Email verification with 4-digit codes"
echo "   - Secure sign-in/sign-up"
echo "   - Password reset functionality"
echo "   - User profile management"
