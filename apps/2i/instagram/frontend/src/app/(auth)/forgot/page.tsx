
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4202';

type Step = 'REQUEST' | 'VERIFY' | 'RESET' | 'DONE';

export default function ForgotPage() {
  const router = useRouter();

  
  const [email, setEmail] = useState('');
  const emailValid = EMAIL_RE.test(email.trim());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  
  const [step, setStep] = useState<Step>('REQUEST');

  
  const OTP_LEN = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(''));
  const otpRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LEN).fill(null));
  const code = otp.join('');
  const codeValid = code.length === OTP_LEN;

  
  const [cooldown, setCooldown] = useState(0); 

  
  const [newPw, setNewPw] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    let id: any;
    if (cooldown > 0) {
      id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    }
    return () => clearTimeout(id);
  }, [cooldown]);

  async function requestCode() {
    if (!emailValid) return;
    setLoading(true); setErr(null);
    try {
      const res = await fetch(`${API}/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error('Failed to send code');
      setStep('VERIFY');
      setCooldown(60); 
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    if (!codeValid) return;
    setLoading(true); setErr(null);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const json = await res.json();
      if (!res.ok || !json?.resetToken) throw new Error(json?.error || 'Invalid code');
      setResetToken(json.resetToken);
      setStep('RESET');
    } catch (e: any) {
      setErr(e?.message ?? 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!resetToken || newPw.trim().length < 8) return;
    setLoading(true); setErr(null);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resetToken, newPassword: newPw }),
      });
      if (!res.ok) throw new Error('Could not reset password');
      setStep('DONE');
    } catch (e: any) {
      setErr(e?.message ?? 'Could not reset password');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(i: number, v: string) {
    const d = v.replace(/\D/g, '').slice(-1); // зөвхөн сүүлийн цифр
    const copy = [...otp]; copy[i] = d;
    setOtp(copy);
    if (d && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-[350px]">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-300">
            
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 8a1 1 0 112 0 1 1 0 01-2 0zm3-8H10V6a2 2 0 114 0v2z" fill="currentColor" />
            </svg>
          </div>

          <h2 className="text-center text-[15px] font-semibold mb-1">Trouble logging in?</h2>

          
          {step === 'REQUEST' && (
            <p className="text-center text-sm text-gray-500 mb-4">
              Enter your email and we’ll send you a code to get back into your account.
            </p>
          )}
          {step === 'VERIFY' && (
            <p className="text-center text-sm text-gray-500 mb-4">
              We’ve sent a 6-digit code to <span className="font-medium">{email.trim().toLowerCase()}</span>.
            </p>
          )}
          {step === 'RESET' && (
            <p className="text-center text-sm text-gray-500 mb-4">
              Enter a new password for your account.
            </p>
          )}
          {step === 'DONE' && (
            <p className="text-center text-sm text-gray-600 mb-4">
              Password updated. You can now log in.
            </p>
          )}

          
          {err && <p className="mb-3 text-xs text-center text-red-600">{err}</p>}

          
          {step === 'REQUEST' && (
            <div className="space-y-3">
              <input
                type="email"
                inputMode="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                disabled={!emailValid || loading}
                onClick={requestCode}
                className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send login link'}
              </button>

              
              <div className="my-2 flex items-center justify-center gap-3 text-xs text-gray-400">
                <span className="block h-px w-full bg-gray-200" />
                <span>OR</span>
                <span className="block h-px w-full bg-gray-200" />
              </div>

<div className="text-center text-sm">
  <Link href="/signup" className="text-black-600 font-medium hover:underline">
    Create new account
  </Link>
</div>


              <button
                onClick={() => router.push('/login')}
                className="mt-2 w-full rounded-md bg-gray-100 py-2 text-sm text-gray-700"
              >
                Back to login
              </button>
            </div>
          )}

          {step === 'VERIFY' && (
            <div className="space-y-3">
              
<div className="flex justify-between">
  {otp.map((v, i) => (
    <input
      key={i}
      ref={(el) => { otpRefs.current[i] = el; }}  
      type="text"
      inputMode="numeric"
      maxLength={1}
      className="w-10 rounded border border-gray-300 bg-[#fafafa] px-0 py-2 text-center text-lg focus:outline-none focus:border-gray-400"
      value={v}
      onChange={(e) => handleOtpChange(i, e.target.value)}
      onKeyDown={(e) => handleOtpKey(i, e)}
    />
  ))}
</div>

              <button
                disabled={!codeValid || loading}
                onClick={verifyCode}
                className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Verify code'}
              </button>

              <div className="text-center text-xs text-gray-500">
                Didn’t get a code?{' '}
                <button
                  disabled={cooldown > 0}
                  onClick={requestCode}
                  className="text-blue-600 disabled:text-gray-400"
                >
                  Resend
                </button>
                {cooldown > 0 && <span> in {cooldown}s</span>}
              </div>

              <button
                onClick={() => setStep('REQUEST')}
                className="mt-2 w-full rounded-md bg-gray-100 py-2 text-sm text-gray-700"
              >
                Back
              </button>
            </div>
          )}

          {step === 'RESET' && (
            <div className="space-y-3">
              <input
                type="password"
                autoComplete="new-password"
                placeholder="New password (min 8)"
                className="w-full rounded border border-gray-300 bg-[#fafafa] px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />

              <button
                disabled={newPw.trim().length < 8 || loading}
                onClick={resetPassword}
                className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save password'}
              </button>
            </div>
          )}

          {step === 'DONE' && (
            <div className="space-y-3 text-center">
              <button
                onClick={() => router.push('/login')}
                className="w-full rounded-md bg-[#4cb5f9] py-2 text-white text-sm font-medium"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
