import { Suspense } from 'react';
import NewPassword from '../../../../components/auth/NewPassword';

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <NewPassword />
      </Suspense>
    </div>
  );
}
