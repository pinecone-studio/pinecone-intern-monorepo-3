#!/bin/bash

echo "🔐 RealEstate MN - Clerk Authentication Setup"
echo "=============================================="
echo ""
echo "This script will help you set up Clerk authentication."
echo ""
echo "First, you need to:"
echo "1. Sign up at https://clerk.com (it's free!)"
echo "2. Create a new application in the Clerk Dashboard"
echo "3. Get your API keys from the 'API Keys' section"
echo ""
read -p "Do you have your Clerk keys ready? (y/n): " ready

if [ "$ready" != "y" ]; then
    echo ""
    echo "No problem! Here's what to do:"
    echo "1. Visit: https://dashboard.clerk.com"
    echo "2. Create an application"
    echo "3. Copy your keys and run this script again"
    echo ""
    exit 0
fi

echo ""
echo "Great! Let's set up your environment variables."
echo ""
read -p "Enter your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_test_...): " pub_key
read -p "Enter your CLERK_SECRET_KEY (sk_test_...): " secret_key

# Create .env.local file
cat > .env.local << ENVFILE
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${pub_key}
CLERK_SECRET_KEY=${secret_key}

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
ENVFILE

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "📝 Created: .env.local"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npx nx serve state-frontend"
echo "2. Visit: http://localhost:4201"
echo "3. Click 'Sign Up' to test authentication"
echo ""
echo "🎉 You're all set!"
