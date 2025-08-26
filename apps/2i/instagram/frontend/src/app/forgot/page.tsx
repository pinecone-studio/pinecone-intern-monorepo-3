'use client';

import Link from 'next/link';

const ForgotPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Forgot Password Card */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* Lock Icon and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Trouble logging in?</h1>
            <p className="text-sm text-gray-600">Enter your email and we&apos;ll send you a link to get back into your account</p>
          </div>

          {/* Forgot Password Form */}
          <form className="space-y-4">
            <div>
              <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* Send Login Link Button */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 font-medium">
              Send login link
            </button>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Create New Account Button */}
            <Link href="/signup" className="w-full bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200 font-medium block text-center">
              Create new account
            </Link>

            {/* Back to Login Button */}
            <Link href="/login" className="w-full bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200 font-medium block text-center">
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;
