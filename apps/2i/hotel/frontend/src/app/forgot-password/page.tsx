'use client';
import { useState } from 'react';
import ForgotPassword from './_component/ForgotPassword';
import VerifyEmail from './_component/VerifyCode';
import ResetPassword from './_component/ResetPassword';

const BLUE = '#2563EB';

export default function Page() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: BLUE }} />
          <span className="text-xl">Pedia</span>
        </div>

        <div className="">
          {step === 1 && <ForgotPassword email={email} setEmail={setEmail} onNext={() => setStep(2)} />}
          {step === 2 && <VerifyEmail email={email} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <ResetPassword onDone={() => alert('Password reset success!')} />}
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-8">©2024 Pedia is an Pedia Group company.</p>
      </div>
    </div>
  );
}
