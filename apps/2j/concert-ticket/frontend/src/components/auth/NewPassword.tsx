'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NewPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/reset-password');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.');
      setIsLoading(false);
      return;
    }

    try {
      // Get the verification code from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code') || '';

      // Call the backend API to set new password
      const response = await fetch('http://localhost:4000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation SetNewPassword($input: SetNewPasswordInput!) {
              setNewPassword(input: $input)
            }
          `,
          variables: {
            input: {
              email: email,
              code: code,
              newPassword: password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.setNewPassword) {
        setSuccess(true);
      } else {
        throw new Error('Нууц үг солихөд алдаа гарлаа');
      }
    } catch (err: any) {
      setError(err.message || 'Нууц үг солихөд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Амжилттай</h1>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-gray-300 text-sm">Таны нууц үг амжилттай солигдлоо.</p>

          <p className="text-gray-400 text-xs">Одоо шинэ нууц үгээрээ нэвтэрч болно.</p>

          <Link href="/sign-in" className="block w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors font-medium text-center">
            Нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Шинэ нууц үг үүсгэх</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
            Шинэ нууц үг:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2">
            Нууц үг баталгаажуулах:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
            required
            minLength={6}
          />
        </div>

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Нууц үг солиж байна...' : 'Нууц үг солих'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/sign-in" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
          Нэвтрэх хуудас руу буцах
        </Link>
      </div>
    </div>
  );
}
