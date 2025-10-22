'use client';

import { useState } from 'react';
import { useForgotPasswordMutation } from '@/generated';

interface ResetPasswordEmailProps {
  onEmailSubmitted: (email: string) => void;
}

export default function ResetPasswordEmail({ onEmailSubmitted }: ResetPasswordEmailProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, errors } = await forgotPassword({
        variables: { email },
      });

      if (errors) {
        console.error('GraphQL errors:', errors);
        setError('Алдаа гарлаа. Дахин оролдоно уу.');
        return;
      }

      if (data?.forgotPassword === true) {
        console.log('Password reset code sent to:', email);
        onEmailSubmitted(email);
      } else {
        setError('Имэйл хаяг олдсонгүй');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6">
        <h1 className="text-center font-bold text-2xl">Нууц үг сэргээх</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Имэйл хаяг:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-400 text-black rounded-lg py-3 text-center hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ачааллаж байна...' : 'Үргэлжлүүлэх'}
          </button>
        </form>
      </div>
    </div>
  );
}
