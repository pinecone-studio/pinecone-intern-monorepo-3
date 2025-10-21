'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { useMyBookingsQuery } from '@/generated';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  artist: string;
  concert: string;
  ticketType: string;
  price: string;
  quantity: number;
  total: string;
}

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // GraphQL query
  const { data: bookingsData, loading: bookingsLoading, error: bookingsError } = useMyBookingsQuery({
    errorPolicy: 'all'
  });

  
  // Backend дата-г Order interface-д хөрвүүлэх
  const orders: Order[] = bookingsData?.myBookings?.map((booking) => ({
    id: booking.id,
    orderNumber: `#${booking.id.slice(-4).toUpperCase()}`,
    date: new Date(booking.bookingDate).toLocaleDateString('mn-MN').replace(/\//g, '.'),
    artist: booking.concert?.mainArtist?.name || 'Unknown Artist',
    concert: booking.concert?.name || 'Unknown Concert',
    ticketType: booking.ticketCategory?.type || 'Unknown',
    price: `${booking.unitPrice.toLocaleString('en-US').replace(/,/g, "'")}₮`,
    quantity: booking.quantity,
    total: `${booking.totalPrice.toLocaleString('en-US').replace(/,/g, "'")}₮`
  })) || [];

  const handleCancelOrder = (_orderId: string) => {
    // TODO: API call to cancel order
  };

  // Loading state
  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]">
            <h1 className="text-[32px] font-bold">Order History</h1>
          </div>
          <div className="flex gap-[24px]">
            <ProfileMenu />
            <div className="flex-1">
              <div className="animate-pulse">
                <div className="h-[20px] bg-gray-700 rounded mb-[20px]"></div>
                <div className="space-y-[16px]">
                  <div className="h-[60px] bg-gray-700 rounded"></div>
                  <div className="h-[60px] bg-gray-700 rounded"></div>
                  <div className="h-[60px] bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (bookingsError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
          <div className="mb-[24px]">
            <h1 className="text-[32px] font-bold">Order History</h1>
          </div>
          <div className="flex gap-[24px]">
            <ProfileMenu />
            <div className="flex-1">
              <div className="rounded-[12px] bg-red-900/30 p-[24px] text-red-200">
                <h2 className="text-[20px] font-semibold mb-[12px]">Алдаа</h2>
                <p>Захиалгын түүх авахад алдаа гарлаа. Дахин оролдоно уу.</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
        <div className="mb-[24px]">
          <h1 className="text-[32px] font-bold">Order History</h1>
        </div>

        <div className="flex gap-[24px]">
          <ProfileMenu />
          
          <div className="flex-1">
            {/* Search */}
            <div className="mb-[24px] flex items-center gap-[12px]">
              <div className="relative flex-1 max-w-[400px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Хайлт..."
                  className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] pr-[40px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <Search size={18} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-[16px]">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[12px] bg-[#111111] p-[20px]">
                  <div className="mb-[16px] flex items-center justify-between">
                    <div>
                      <span className="text-[14px] text-gray-400">Захиалгын дугаар: </span>
                      <span className="text-[14px] font-medium">{order.orderNumber}, {order.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[16px]">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Артист</div>
                      <div className="text-[14px]">{order.artist}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Тоглолт</div>
                      <div className="text-[14px]">{order.concert}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Тасалбарын төрөл</div>
                      <div className="text-[14px]">{order.ticketType}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Үнэ</div>
                      <div className="text-[14px]">{order.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[16px]">
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Тоо</div>
                      <div className="text-[14px]">{order.quantity}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-400 mb-[4px]">Нийт дүн</div>
                      <div className="text-[14px] font-medium">{order.total}</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="rounded-[8px] bg-red-600 px-[16px] py-[8px] text-[12px] font-medium text-white hover:bg-red-700 transition-colors"
                    >
                      Цуцлах
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-[60px] text-gray-400">
                <div className="text-[24px] mb-[8px]">♡</div>
                <div>Захиалга олдсонгүй</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
