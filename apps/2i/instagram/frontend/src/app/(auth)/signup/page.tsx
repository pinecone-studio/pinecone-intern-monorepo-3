'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [t, setT] = useState<{ [k: string]: boolean }>({});


  const emailValid = EMAIL_RE.test(email.trim());
  const pwValid = pw.trim().length >= 8;
  const usernameValid = username.trim().length >= 3; // түр дүрэм
  const canSubmit = emailValid && pwValid && usernameValid;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    alert('Signed up (front-only demo)');
    router.replace('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-[350px]">
        <div className="bg-white border border-gray-200 rounded-lg p-8">

          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Instagram" width={180} height={52} priority />
          </div>


          <p className="text-center text-sm text-gray-500 mb-4 leading-5">
            <span>Sign up to see photos and videos</span>
            <br />
            <span>from your friends</span>
          </p>

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
                <p className="mt-1 text-xs text-red-600">Email only — phone numbers are not accepted.</p>
              )}
            </div>

            <div>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onBlur={() => setT((s) => ({ ...s, pw: true }))}
              />
              {t.pw && !pwValid && <p className="mt-1 text-xs text-red-600">At least 8 characters.</p>}
            </div>

            <div>
              <input
                type="text"
                autoComplete="name"
                placeholder="Full Name"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                autoComplete="username"
                placeholder="Username"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setT((s) => ({ ...s, username: true }))}
              />
              {t.username && !usernameValid && (
                <p className="mt-1 text-xs text-red-600">Username must be at least 3 characters.</p>
              )}
            </div>


            <p className="text-[11px] text-center text-gray-500 leading-4">
              <span>People who use our service may have uploaded</span>
              <br />
              <span>your contact information to Instagram. </span>
              <a className="text-blue-600 hover:underline" href="#">
                <span>Learn</span>
                <br />
                <span>More</span>
              </a>
            </p>


            <p className="text-[11px] text-center text-gray-500 leading-4">
              <span>By signing up, you agree to our </span>
              <a className="text-blue-600 hover:underline" href="#">
                <span>Terms , Privacy</span>
                <br />
                <span>Policy</span>
              </a>
              <span> and </span>
              <a className="text-blue-600 hover:underline" href="#">
                Cookies Policy.
              </a>
            </p>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium disabled:opacity-50"
            >
              Sign up
            </button>
          </form>
        </div>

        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 text-center text-sm">
          Have an account?{' '}
          <a className="text-blue-600 font-medium hover:underline" href="/login">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
