'use client';
import React from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ProfileMenu from '@/components/profile/ProfileMenu';
import { useMyBookingsQuery } from '@/generated';
import OrderCard from '@/components/orders/OrderCard';

const OrdersPage: React.FC = () => {
  const { data, loading, error } = useMyBookingsQuery();

  if (error) {
    console.error('Error fetching bookings:', JSON.stringify(error, null, 2));
  }

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-400">Ачааллаж байна...</div>;
    }

    if (error) {
      return <div className="rounded-[8px] border border-red-800 bg-red-900/20 p-[16px] text-center text-red-200">Захиалгын мэдээлэл авахад алдаа гарлаа.</div>;
    }

    if (!data?.myBookings || data.myBookings.length === 0) {
      return <div className="text-center text-gray-400">Захиалга олдсонгүй.</div>;
    }

    return (
      <div className="space-y-[16px]">
        {data.myBookings.map((booking) => (
          <OrderCard key={booking.id} booking={booking} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
        <div className="mb-[24px]">
          <h1 className="text-[32px] font-bold">User Profile</h1>
        </div>

        <div className="flex gap-[24px]">
          <ProfileMenu />

          <div className="flex-1">
            <h2 className="mb-[20px] text-[20px] font-semibold">Захиалгын мэдээлэл</h2>
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
