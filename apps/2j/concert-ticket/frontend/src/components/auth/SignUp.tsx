'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
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
      console.log('Sign up attempt:', { email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just redirect to success page
      window.location.href = '/sign-up/success';
    } catch (err) {
      setError('Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Бүртгүүлэх</h1>

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
            Нууц үг үүсгэх:
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
          {isLoading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Хэрэв та бүртгэлтэй хаягтай бол{' '}
          <Link href="/sign-in" className="underline hover:text-blue-300 transition-colors">
            нэвтрэх
          </Link>{' '}
          хэсгээр орно уу.
        </p>
      </div>
    </div>
  );
}
