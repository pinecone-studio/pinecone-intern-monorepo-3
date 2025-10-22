'use client';

import { useState } from 'react';
import ResetPasswordEmail from '../../../components/auth/ResetPasswordEmail';
import ResetPasswordVerify from '../../../components/auth/ResetPasswordVerify';
import ResetPasswordNew from '../../../components/auth/ResetPasswordNew';

type ResetStep = 'email' | 'verify' | 'new-password';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('verify');
  };

  const handleCodeVerified = (verifiedEmail: string, verifiedCode: string) => {
    setEmail(verifiedEmail);
    setCode(verifiedCode);
    setStep('new-password');
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
    setCode('');
  };

  const handleBackToVerify = () => {
    setStep('verify');
    setCode('');
  };

  return (
    <>
      {step === 'email' && <ResetPasswordEmail onEmailSubmitted={handleEmailSubmitted} />}

      {step === 'verify' && <ResetPasswordVerify email={email} onCodeVerified={handleCodeVerified} onBack={handleBackToEmail} />}

      {step === 'new-password' && <ResetPasswordNew email={email} code={code} onBack={handleBackToVerify} />}
    </>
  );
}
