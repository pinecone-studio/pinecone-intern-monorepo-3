import { Suspense } from 'react';
import ResetPasswordVerify from '../../../../components/auth/ResetPasswordVerify';

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordVerify />
      </Suspense>
    </div>
  );
}
