'use client';

import { useState, useRef, useEffect } from 'react';

interface ResetPasswordVerifyProps {
  email: string;
  onCodeVerified: (email: string, code: string) => void;
  onBack: () => void;
}

export default function ResetPasswordVerify({ email, onCodeVerified, onBack }: ResetPasswordVerifyProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const moveToNextInput = (index: number, value: string) => {
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const checkAutoSubmit = (newCode: string[]) => {
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 4) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    moveToNextInput(index, value);
    checkAutoSubmit(newCode);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    setError('');
    setIsLoading(true);

    console.log('Code verified successfully:', codeString);
    setTimeout(() => {
      onCodeVerified(email, codeString);
      setIsLoading(false);
    }, 500);
  };

  const handleResend = () => {
    setCode(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    console.log('Resending code to:', email);
  };

  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6">
        <div className="text-center text-gray-300 mb-4">
          <p>Таны имэйл хаягт илгээсэн 4 оронтой кодыг оруулна уу.</p>
        </div>

        <div className="flex justify-center mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 bg-black border border-gray-700 text-white text-center text-xs focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <div className="flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button onClick={handleResend} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {isLoading && <div className="text-center text-gray-400">Баталгаажуулж байна...</div>}
      </div>
    </div>
  );
}
