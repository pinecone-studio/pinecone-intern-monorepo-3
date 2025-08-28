'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-cy="forgot-page">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Padlock Icon - хар өнгөтэй */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trouble logging in?</h1>
          <p className="text-gray-600 text-sm">Enter your email and we'll send you a link to get back into your account.</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            data-cy="email-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button data-cy="submit-button" type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Send login link
          </button>

          {/* OR Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Create new account button - хар өнгөтэй */}
          <Link href="/signup" className="w-full bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-center block">
            Create new account
          </Link>
        </form>

        {/* Back to login button - цагаан дэвсгэртэй, хар текст */}
        <div className="mt-8 text-center">
          <Link href="/login" className="inline-block bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
