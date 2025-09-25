'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
const emailSchema = z.object({
  email: z.string().trim().email('И-мэйл буруу байна'),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErr, setFieldErr] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErr(null);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldErr(parsed.error.issues[0]?.message || 'И-мэйл буруу байна');
      return;
    }

    router.push('/');
  };

  const inputClass = (hasError: boolean) =>
    `mt-1 w-full rounded-md bg-white px-3 py-2 text-sm shadow-sm outline-none
     ${hasError ? 'border border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-200' : 'border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 bg-[#2563EB] rounded-full" />
              <span className="text-xl">Pedia</span>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500">Enter your email below to sign in</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium ${fieldErr ? 'text-red-600' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(!!fieldErr)}
                aria-invalid={!!fieldErr}
                aria-describedby="email-error"
              />
              {fieldErr && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {fieldErr}
                </p>
              )}
            </div>

            {/* Password  */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass(false)} />
            </div>

            <button type="submit" className="w-full rounded-md bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700">
              Continue
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <a href="/signup" className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Create an account
            </a>
          </form>

          <p className="mt-6 text-center text-[10px] text-gray-400">
            By clicking continue, you agree to our{' '}
            <a className="underline" href="/terms">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="underline" href="/privacy">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">©2024 Pedia Group Co.</p>
      </div>
    </div>
  );
}
