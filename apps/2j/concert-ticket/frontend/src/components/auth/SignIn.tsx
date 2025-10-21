'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual authentication logic
      console.log('Sign in attempt:', { email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just redirect to home
      window.location.href = '/';
    } catch (err) {
      setError('Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Нэвтрэх</h1>

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

        <div>
          <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
            Нууц үг:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Нэвтрэж байна...' : 'Нэвтрэх'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-gray-400 text-sm">
          Хэрэв та бүртгэлтэй хаяггүй бол{' '}
          <Link href="/sign-up" className="underline hover:text-blue-300 transition-colors">
            бүртгүүлэх
          </Link>{' '}
          хэсгээр орно уу.
        </p>

        <div>
          <Link href="/reset-password" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
            Нууц үгээ мартсан уу?
          </Link>
        </div>
      </div>
    </div>
  );
}
