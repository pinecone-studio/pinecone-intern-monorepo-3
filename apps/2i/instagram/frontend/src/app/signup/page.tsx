'use client';

import Link from 'next/link';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Signup Card */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* Instagram Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram</h1>
            <p className="text-sm text-gray-600">Sign up to see photos and videos from your friends</p>
          </div>

          {/* Signup Form */}
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Mobile Number or Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input type="text" placeholder="Full Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <input type="text" placeholder="Username" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {/* Terms and Privacy */}
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                People who use our service may have uploaded your contact information to Instagram.{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Learn More
                </Link>
              </p>
              <p>
                By signing up, you agree to our{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Terms
                </Link>
                ,{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Cookies Policy
                </Link>
                .
              </p>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 font-medium">
              Sign up
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="bg-white py-4 px-6 shadow rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
