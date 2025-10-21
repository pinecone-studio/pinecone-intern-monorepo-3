'use client';

import Link from 'next/link';

export default function UserProfile() {
  return (
    <div className="bg-black min-h-screen w-screen flex justify-center items-center text-white p-4">
      <div className="w-2/3 max-w-lg border border-neutral-600 rounded-md flex flex-col p-8 gap-6">
        <h1 className="text-center font-bold text-2xl">Хэрэглэгчийн мэдээлэл</h1>

        <div className="text-center text-neutral-400">
          <p>Clerk authentication is not configured.</p>
          <p className="mt-2">Please set up your Clerk keys to view user profile.</p>
        </div>

        <div className="flex gap-4">
          <Link href="/sign-in" className="flex-1 bg-blue-400 text-black rounded-lg py-3 text-center hover:bg-blue-500 transition-colors font-medium">
            Нэвтрэх
          </Link>
          <Link href="/" className="flex-1 bg-neutral-700 text-white rounded-lg py-3 text-center hover:bg-neutral-600 transition-colors font-medium">
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
