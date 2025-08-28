'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-cy="login-page">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            data-cy="email-input"
            type="email"
            placeholder="Phone number, username, or email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="password-input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button data-cy="submit-button" type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot" className="text-blue-900 hover:underline text-sm">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-4">
            People who use our service may have uploaded your contact information to Instagram.{' '}
            <a href="#" className="text-blue-900 hover:underline">
              Learn more
            </a>
          </p>
          <p className="text-xs text-gray-500">
            By logging in, you agree to our{' '}
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
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
