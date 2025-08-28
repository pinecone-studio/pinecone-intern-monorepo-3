'use client';

import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-cy="signup-page">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
          <p className="text-gray-600 text-sm">Sign up to see photos and videos from your friends.</p>
        </div>

        <form className="space-y-4">
          <input
            data-cy="email-input"
            type="email"
            placeholder="Mobile Number or Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="full-name-input"
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="username-input"
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="password-input"
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button data-cy="submit-button" type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Sign up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-4">
            People who use our service may have uploaded your contact information to Instagram.{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Learn more
            </a>
          </p>
          <p className="text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <a href="/login" className="text-blue-900 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
