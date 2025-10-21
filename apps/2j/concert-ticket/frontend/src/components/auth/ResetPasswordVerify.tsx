'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/reset-password');
    }
  }, [email, router]);

  const focusNextInput = (index: number) => {
    if (index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutoSubmit = (newCode: string[]) => {
    const fullCode = newCode.join('');
    if (fullCode.length === 4) {
      setTimeout(() => {
        verifyCode(fullCode);
      }, 500);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value) {
      focusNextInput(index);
      if (index === 3) {
        handleAutoSubmit(newCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Call the backend API to verify reset code
      const response = await fetch('http://localhost:4000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ResetPassword($input: ResetPasswordInput!) {
              resetPassword(input: $input)
            }
          `,
          variables: {
            input: {
              email: email,
              code: fullCode,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.resetPassword) {
        setIsVerified(true);
      } else {
        throw new Error('Буруу код байна');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Буруу код байна. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      // Call the backend API to resend reset code
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
        alert('Нууц үг сэргээх код дахин илгээгдлээ.');
      } else {
        throw new Error('Код дахин илгээхэд алдаа гарлаа');
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Код дахин илгээхэд алдаа гарлаа.');
    }
  };

  if (isVerified) {
    return (
      <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-white text-2xl font-semibold text-center mb-8">Шинэ нууц үг үүсгэх</h1>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-gray-300 text-sm">Код амжилттай баталгаажлаа. Одоо шинэ нууц үг үүсгэж болно.</p>

          <Link
            href={`/reset-password/new-password?email=${encodeURIComponent(email)}&code=${code.join('')}`}
            className="block w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors font-medium text-center"
          >
            Шинэ нууц үг үүсгэх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090B] rounded-lg p-8 w-full max-w-md border border-gray-800">
      <h1 className="text-white text-2xl font-semibold text-center mb-8">Код баталгаажуулах</h1>

      <div className="text-center mb-6">
        <p className="text-gray-300 text-sm mb-2">
          <strong className="text-white">{email}</strong> хаяг руу илгээсэн
        </p>
        <p className="text-gray-400 text-sm">4 оронтой кодыг оруулна уу</p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            className="w-12 h-12 bg-gray-800 border border-gray-700 rounded text-center text-xl focus:outline-none focus:border-blue-500 text-white"
            disabled={isLoading}
          />
        ))}
      </div>

      {error && <div className="text-red-400 text-sm text-center mb-4">{error}</div>}

      <div className="text-center space-y-4">
        <button onClick={resendCode} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
          Код дахин илгээх
        </button>

        <div>
          <Link href="/reset-password" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
