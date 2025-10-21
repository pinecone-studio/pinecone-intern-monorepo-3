'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CartContent } from '../../components/cart/cart-content';

function CartPageContent() {
  const searchParams = useSearchParams();

  const concertId = searchParams.get('concertId');
  const selectedDate = searchParams.get('selectedDate');

  if (!concertId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Алдаа</h1>
          <p className="text-gray-300">Концертын мэдээлэл олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CartContent concertId={concertId} selectedDate={selectedDate} />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ачааллаж байна...</h1>
        </div>
      </div>
    }>
      <CartPageContent />
    </Suspense>
  );
}
