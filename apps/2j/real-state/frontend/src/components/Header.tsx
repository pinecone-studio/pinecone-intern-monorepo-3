/* eslint-disable complexity */
'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { LogIn, UserPlus, Plus, Shield } from 'lucide-react';
import { isAdmin } from '../lib/user-roles';

const Header = () => {
  const { user } = useUser();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              🏘️ RealEstate MN
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Contact
            </Link>

            {/* Show when user is NOT signed in */}
            <SignedOut>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </SignedOut>

            {/* Show when user IS signed in */}
            <SignedIn>
              <div className="flex items-center gap-4">
                {/* Add Property Link */}
                <Link
                  href="/add-property"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>

                {/* Admin Dashboard Link */}
                {user?.primaryEmailAddress?.emailAddress && isAdmin(user.primaryEmailAddress.emailAddress) && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-gray-900">{user?.firstName || 'User'}</span>
                </div>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 ring-2 ring-blue-500 ring-offset-2',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;