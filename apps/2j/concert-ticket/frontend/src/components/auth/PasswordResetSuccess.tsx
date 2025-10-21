'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordResetSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 1.5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 1500);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6 items-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-transparent border-2 border-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-center text-white text-sm">Амжилттай үүсгэлээ.</p>
      </div>
    </div>
  );
}
