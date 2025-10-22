'use client';

import { useState } from 'react';
import { useResetPasswordMutation } from '@/generated';
import { useRouter } from 'next/navigation';

interface ResetPasswordNewProps {
  email: string;
  code: string;
  onBack: () => void;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  placeholder: string;
}) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-blue-500"
        required
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
        {showPassword ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  </div>
);

export default function ResetPasswordNew({ email, code }: ResetPasswordNewProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [resetPassword] = useResetPasswordMutation();

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      const { data, errors } = await resetPassword({
        variables: { email, code, newPassword },
      });

      if (errors) {
        console.error('GraphQL errors:', errors);
        setError('Алдаа гарлаа. Дахин оролдоно уу.');
        return;
      }

      if (data?.resetPassword === true) {
        console.log('Password reset successfully');
        router.push('/sign-in?reset=success');
      } else {
        setError('Нууц үг сэргээхэд алдаа гарлаа');
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
        <h1 className="text-center font-bold text-2xl">Шинэ нууц үг</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Шинэ нууц үг:"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Хамгийн багадаа 6 тэмдэгт"
          />

          <PasswordInput
            label="Нууц үг баталгаажуулах:"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            placeholder="Нууц үгээ дахин оруулна уу"
          />

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-400 text-black rounded-lg py-3 text-center hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ачааллаж байна...' : 'Үргэлжлүүлэх'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
