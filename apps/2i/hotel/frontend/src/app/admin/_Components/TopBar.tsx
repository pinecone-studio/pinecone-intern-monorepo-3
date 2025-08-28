'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import link from 'next/link';

export const TopBar = () => {
  const router = useRouter();

  const someHandler = () => {
    router.push('/admin/hotels/create');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold">Hotels</h1>

      <button onClick={someHandler} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        <Plus className="h-4 w-4" />
        Add Hotel
      </button>
    </div>
  );
};
