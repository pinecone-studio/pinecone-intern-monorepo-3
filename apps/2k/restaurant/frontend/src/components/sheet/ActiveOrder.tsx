'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ActiveOrderContentProps {
  onBack: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  count: number;
  image: string;
}

interface LastOrder {
  orderNumber: number;
  status: string;
  createdAt: string;
  items: any[];
  totalPrice: number;
  paymentMethod: string;
  orderType: string;
  tableQr: string;
  tableId: string;
}

export const ActiveOrderContent = ({ onBack }: ActiveOrderContentProps) => {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastOrderString = localStorage.getItem('lastOrder');
    if (lastOrderString) {
      try {
        const lastOrder = JSON.parse(lastOrderString);
        setOrder(lastOrder);
      } catch (e) {
        console.error('Failed to parse lastOrder:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Ачаалж байна...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="font-medium text-[#441500] text-lg mb-4">Захиалгын дэлгэрэнгүй</h1>
        <p className="text-gray-600">Захиалга олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full p-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="mb-6">
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#441500] transition mb-2 flex items-center gap-2">
            <span>←</span>
            <span>Буцах</span>
          </button>
          <h1 className="font-semibold text-[#441500] text-xl">Захиалгын дэлгэрэнгүй</h1>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          {/* Order Number */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xs text-gray-500 font-medium">Захиалгын дугаар</h2>
            <p className="text-xl font-bold text-[#441500]">#{order.orderNumber}</p>
          </div>

          <div className="border-t border-gray-200" />

          {/* Status */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xs text-gray-500 font-medium">Захиалгын төлөв</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 w-fit">{order.status}</span>
          </div>

          <div className="border-t border-gray-200" />

          {/* Date */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xs text-gray-500 font-medium">Захиалсан огноо</h2>
            <p className="text-base text-gray-900 font-medium">
              {new Date(order.createdAt).toLocaleDateString('mn-MN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="border-t border-gray-200" />

          {/* Order Items */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs text-gray-500 font-medium">Захиалга</h2>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image alt={item.name || 'food'} src={item.image || 'https://via.placeholder.com/80'} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 mb-1">{item.name}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>
                        Үнэ: <span className="font-medium text-[#441500]">{item.price?.toLocaleString()}₮</span>
                      </span>
                      <span>
                        Тоо: <span className="font-medium">{item.selectCount || item.count}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">Нийт дүн:</span>
              <span className="text-xl font-bold text-[#441500]">{order.totalPrice?.toLocaleString()}₮</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
