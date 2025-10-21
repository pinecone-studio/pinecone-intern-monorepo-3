'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);

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
    try {
      // TODO: Implement API call to verify the code
      console.log('Verifying code:', fullCode);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to sign-in page after successful verification
      router.push('/sign-in');
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Invalid verification code');
    }
  };

  const goBack = () => {
    router.back();
  };

  const resendCode = async () => {
    try {
      // TODO: Implement resend code functionality
      alert('Verification code has been resent to your email');
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Failed to resend code');
    }
  };

  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6">
        <p className="text-center text-white text-sm">Имэйл хаяг руу илгээсээн 4 оронтой кодыг оруулна уу</p>

        <div className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="w-12 h-12 bg-black border border-neutral-600 rounded text-center text-xl focus:outline-none focus:border-white"
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button onClick={goBack} className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button onClick={resendCode} className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
