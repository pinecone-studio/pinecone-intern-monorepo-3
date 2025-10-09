'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';

type Step = 'email' | 'reset' | 'code' | 'success';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call forgotPassword(email)
    // Next: user sets a new password
    setStep('reset');
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow 0-9 single char
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const verifyCode = () => {
    // TODO: verify code
    setStep('success');
  };

  const submitReset = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return; // basic guard
    // TODO: send resetPassword to backend (will require code verification next)
    setStep('code');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6">
        {step === 'email' && (
          <div>
            <h1 className="text-center text-4xl font-semibold text-black mb-8">Нууц үг сэргээх</h1>
            <form onSubmit={submitEmail} className="space-y-4">
              <input
                type="email"
                placeholder="Имэйл хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              <button type="submit" className="w-full rounded-md bg-black text-white py-3 text-lg font-medium hover:opacity-90 transition">
                Үргэлжлүүлэх
              </button>
            </form>
          </div>
        )}

        {step === 'code' && (
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-8">Имэйл хаяг руу илгээсэн 4 оронтой<br/>кодыг оруулна уу</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  value={code[i]}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  className="h-16 w-16 text-center text-2xl rounded-md border-2 border-gray-300 focus:outline-none focus:border-black"
                />
              ))}
            </div>
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <button onClick={() => setStep('reset')} className="text-2xl">←</button>
              <button onClick={() => setCode(['', '', '', ''])} className="text-2xl">↻</button>
            </div>
            <div className="mt-8">
              <button onClick={verifyCode} className="px-6 py-3 bg-black text-white rounded-md">Үргэлжлүүлэх</button>
            </div>
          </div>
        )}

        {step === 'reset' && (
          <div>
            <h1 className="text-center text-4xl font-semibold text-black mb-8">Шинэ нууц үг</h1>
            <form onSubmit={submitReset} className="space-y-4 max-w-xl mx-auto">
              <input
                type="password"
                placeholder="Нууц үг"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              <input
                type="password"
                placeholder="Нууц үг давтах"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              <button type="submit" className="w-full rounded-md bg-black text-white py-3 text-lg font-medium hover:opacity-90 transition">
                Үүсгэх
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <p className="text-xl font-semibold">Амжилттай үүсгэлээ.</p>
            <div className="mt-6">
              <Link href="/admin/login" className="text-blue-600 hover:underline">Нэвтрэх рүү буцах</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


