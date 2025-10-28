'use client';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SuccessPage = () => {
    const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen px-4 bg-gray-50">
      {/* Success Icon */}
      <div className="flex items-center justify-center w-24 h-24 mb-6 bg-green-100 rounded-full shadow-md">
        <Check size={60} className="text-green-600" />
      </div>

      {/* Message */}
      <p className="mb-6 text-lg font-semibold text-center text-[#441500]">Төлбөр амжилттай төлөгдлөө</p>

      {/* Button at bottom */}
      <div className="absolute flex justify-center w-full px-4 bottom-8">
        <button onClick={() => router.push('/activeOrder')}  className="w-full max-w-xs px-6 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-[#441500] hover:bg-amber-900">
          Захиалгын дэлгэрэнгүй харах
        </button>
      </div>
    </div>
  );
};
