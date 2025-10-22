'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLoginMutation } from '@/generated';
import SuccessModal from './SuccessModal';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Sign in attempt:', { email, password });

      const { data } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data?.login) {
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('user', JSON.stringify(data.login.user));

        console.log('✅ User successfully logged in:', {
          userId: data.login.user.id,
          email: data.login.user.email,
          username: data.login.user.username,
          role: data.login.user.role,
          token: data.login.token.substring(0, 20) + '...',
        });

        console.log('📦 localStorage contents:', {
          token: localStorage.getItem('token')?.substring(0, 20) + '...',
          user: JSON.parse(localStorage.getItem('user') || '{}'),
        });

        setShowSuccessModal(true);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    window.location.href = '/';
  };

  return (
    <>
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
            <label htmlFor="password" className="text-sm text-gray-300 mb-2 flex items-center justify-between">
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

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Хэрэв та бүртгэлтэй хаяггүй бол{' '}
            <Link href="/sign-up" className="underline hover:text-blue-300 transition-colors">
              бүртгүүлэх
            </Link>{' '}
            хэсгээр орно уу.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Нууц үгээ мартсан?{' '}
            <Link href="/reset-password" className="underline hover:text-blue-300 transition-colors">
              Нууц үг сэргээх
            </Link>
          </p>
        </div>
      </div>

      <SuccessModal isOpen={showSuccessModal} message="Амжилттай нэвтэрлээ." onClose={handleSuccessModalClose} />
    </>
  );
}
