'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegisterMutation } from '@/generated';
import SuccessModal from './SuccessModal';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [register] = useRegisterMutation();

  interface RegisterResponse {
    register: {
      token: string;
      user: {
        id: string;
        email: string;
        username?: string | null;
        role: string;
        createdAt: string;
      };
    };
  }

  const handleRegistrationSuccess = (data: RegisterResponse) => {
    localStorage.setItem('token', data.register.token);
    localStorage.setItem('user', JSON.stringify(data.register.user));

    console.log('🎉 User successfully registered:', {
      userId: data.register.user.id,
      email: data.register.user.email,
      username: data.register.user.username,
      role: data.register.user.role,
      createdAt: data.register.user.createdAt,
      token: data.register.token.substring(0, 20) + '...',
    });

    console.log('📦 localStorage contents:', {
      token: localStorage.getItem('token')?.substring(0, 20) + '...',
      user: JSON.parse(localStorage.getItem('user') || '{}'),
    });

    setShowSuccessModal(true);
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sign up attempt:', { email, password });

      const { data } = await register({
        variables: {
          input: {
            email,
            password,
            username: email.split('@')[0],
          },
        },
      });

      if (data?.register) {
        handleRegistrationSuccess(data);
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.';
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
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Бүртгүүлэх</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-black border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
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
              className="w-full bg-black border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white rounded-lg py-3 px-4 focus:border-blue-500 focus:outline-none transition-colors"
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

      <SuccessModal isOpen={showSuccessModal} message="Амжилттай үүсгэлээ." onClose={handleSuccessModalClose} />
    </>
  );
}
