'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordWithToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/reset-password');
      return;
    }

    // Verify the token when component mounts
    verifyToken();
  }, [token, router]);

  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query VerifyResetToken($token: String!) {
              verifyResetToken(token: $token) {
                valid
                email
              }
            }
          `,
          variables: {
            token: token,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.verifyResetToken.valid) {
        setIsVerified(true);
        setEmail(result.data.verifyResetToken.email || '');
      } else {
        setError('Холбоос хүчинтэй бус эсвэл хугацаа дууссан байна');
      }
    } catch (error: any) {
      setError('Холбоос шалгахэд алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($token: String!, $newPassword: String!) {
              resetPassword(token: $token, newPassword: $newPassword)
            }
          `,
          variables: {
            token: token,
            newPassword: password,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.resetPassword) {
        // Redirect to sign-in page with success message
        router.push('/sign-in?message=password-reset-success');
      } else {
        throw new Error('Нууц үг сэргээхэд алдаа гарлаа');
      }
    } catch (error: any) {
      setError(error.message || 'Нууц үг сэргээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVerified && !error) {
    return (
      <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Холбоос шалгаж байна...</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !isVerified) {
    return (
      <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Алдаа</h1>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <p className="text-red-400 text-sm">{error}</p>

          <Link href="/reset-password" className="block w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors font-medium text-center">
            Дахин оролдох
          </Link>

          <Link href="/sign-in" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
            Нэвтрэх хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Шинэ нууц үг үүсгэх</h1>

      <div className="text-center mb-6">
        <p className="text-gray-300 text-sm mb-2">
          <strong className="text-white">{email}</strong> хаягт зориулсан
        </p>
        <p className="text-gray-400 text-sm">Шинэ нууц үгээ оруулна уу</p>
      </div>

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
            placeholder="Хамгийн багадаа 6 тэмдэгт"
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
            placeholder="Нууц үгээ дахин оруулна уу"
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
          {isLoading ? 'Нууц үг сэргээж байна...' : 'Нууц үг сэргээх'}
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
