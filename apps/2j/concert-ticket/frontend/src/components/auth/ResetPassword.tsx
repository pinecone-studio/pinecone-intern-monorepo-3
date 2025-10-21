'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the backend API to send reset code
      const response = await fetch('http://localhost:4000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ForgotPassword($email: String!) {
              forgotPassword(email: $email)
            }
          `,
          variables: {
            email: email,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.forgotPassword) {
        // Redirect directly to code verification page
        window.location.href = `/reset-password/verify?email=${encodeURIComponent(email)}`;
      } else {
        throw new Error('Код илгээхэд алдаа гарлаа');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Нууц үг сэргээх код илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Нууц үг сэргээх</h1>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-gray-300 text-sm">
            Нууц үг сэргээх холбоос <strong className="text-white">{email}</strong> хаяг руу илгээгдлээ.
          </p>

          <p className="text-gray-400 text-xs">Имэйлээ шалгаж, холбоос дээр дарна уу.</p>

          <p className="text-gray-500 text-xs">Хэрэв имэйл ирээгүй бол спам хавтас шалгана уу.</p>

          <Link href="/sign-in" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
            Нэвтрэх хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Нууц үг сэргээх</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
            Имэйл хаяг:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Код илгээж байна...' : 'Сэргээх код илгээх'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Нууц үгээ санаж байна уу?{' '}
          <Link href="/sign-in" className="underline hover:text-blue-300 transition-colors">
            нэвтрэх
          </Link>{' '}
          хэсгээр орно уу.
        </p>
      </div>
    </div>
  );
}
