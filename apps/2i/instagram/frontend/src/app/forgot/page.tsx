'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForgetverifyMutation } from '@/generated';

const ForgotPage = () => {
  const router = useRouter();
 
const [Forgetverify,{ loading, error }]= useForgetverifyMutation()


  const [email, setEmail] = useState({
    email:''
  });


     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmail(prev => ({ ...prev, [name]: value }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
       try {
      await Forgetverify({
        variables: {
          forget: {
            email: email.email,
          }
        }
      });
      localStorage.setItem("resetEmail", email.email);
      router.push("/forgetotpverify");
    } catch (err) {
      console.error('Failed to signup:', err);
    }
  };
  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-cy="forgot-page">
      <div className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
        
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trouble logging in?</h1>
          <p className="text-gray-600 text-sm">Enter your email and we&apos;ll send you a link to get back into your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            data-testid="email-input"
            type="email"
            placeholder="Email"
            name='email'
            value={email.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button data-cy="submit-button" type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors" data-testid="submit-button">
            Send reset link
          </button>
         {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
         
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

         
          <Link href="/signup" className="w-full bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-center block">
            Create new account
          </Link>
        </form>

        
        <div className="mt-8 text-center">
          <Link href="/login" className="inline-block bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;


