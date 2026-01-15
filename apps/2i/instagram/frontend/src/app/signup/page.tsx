'use client';

import { useSignMutation } from '@/generated';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

const SignupPage = () => {
  const router = useRouter();
  const [Sign, { loading, error }] = useSignMutation();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await Sign({
        variables: {
          signup: {
            email: formData.email,
            fullname: formData.name,
            username: formData.username,
            password: formData.password,
          },
        },
      });
      router.push('/otpverify');
    } catch (err) {
      console.error('Failed to signup:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
          <p className="text-gray-600 text-sm">Sign up to see photos and videos from your friends.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} data-testid="signup-page">
          <input
            data-cy="email-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Mobile Number or Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="full-name-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="username-input"
            type="text"
            value={formData.username}
            onChange={handleChange}
            name="username"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            data-cy="password-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button data-cy="submit-button" type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
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
};

export default SignupPage;
