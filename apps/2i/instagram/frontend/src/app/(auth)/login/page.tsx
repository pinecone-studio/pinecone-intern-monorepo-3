
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [t, setT] = useState<{[k: string]: boolean}>({});

  
  const emailValid = EMAIL_RE.test(email.trim());
  const pwValid = pw.trim().length > 0;
  const canSubmit = emailValid && pwValid;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    
    alert('Logged in (front-only demo)');
    router.replace('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-[350px]">
        
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Instagram" width={180} height={52} priority />
          </div>

          <form className="space-y-3" onSubmit={onSubmit} noValidate>
            
            <div>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Mobile Number or Email"
                title="Email only"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setT((s) => ({ ...s, email: true }))}
              />
              {t.email && !emailValid && (
                <p className="mt-1 text-xs text-red-600">
                  Email only — phone numbers are not accepted.
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onBlur={() => setT((s) => ({ ...s, pw: true }))}
              />
            </div>

            <div className="text-center">
              <a className="text-xs text-blue-600 hover:underline" href="/forgot">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium disabled:opacity-50"
            >
              Log in
            </button>
          </form>
        </div>

        
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 text-center text-sm">
          Don’t have an account?{' '}
          <a className="text-blue-600 font-medium hover:underline" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
