'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
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
  status: string;
  paymentStatus: string;
  canCancel: boolean;
  cancellationDeadline?: Date;
}

interface CancelModalData {
  orderId: string;
  orderNumber: string;
  bank: string;
  accountNumber: string;
  accountHolderName: string;
}

const OrdersPage: React.FC = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelModalData, setCancelModalData] = useState<CancelModalData>({
    orderId: '',
    orderNumber: '',
    bank: '',
    accountNumber: '',
    accountHolderName: ''
  });

  // GraphQL query
  const { data: bookingsData, loading: bookingsLoading, error: bookingsError } = useMyBookingsQuery({
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  
  // Backend дата-г Order interface-д хөрвүүлэх
  const orders: Order[] = bookingsData?.myBookings?.map((booking) => ({
    id: booking.id,
    orderNumber: `#${booking.id.slice(-4).toUpperCase()}`,
    date: new Date(booking.bookingDate).toLocaleDateString('mn-MN').replace(/\//g, '.'),
    artist: booking.concert?.mainArtist?.name || 'Unknown Artist',
    concert: booking.concert?.name || 'Unknown Concert',
    ticketType: booking.ticketCategory?.type || 'Unknown',
    price: `${booking.unitPrice?.toLocaleString('en-US').replace(/,/g, "'") || '0'}₮`,
    quantity: booking.quantity || 0,
    total: `${booking.totalPrice?.toLocaleString('en-US').replace(/,/g, "'") || '0'}₮`,
    status: booking.status || 'PENDING',
    paymentStatus: booking.paymentStatus || 'PENDING',
    canCancel: booking.canCancel || false,
    cancellationDeadline: booking.cancellationDeadline ? new Date(booking.cancellationDeadline) : undefined
  })) || [];

  const handleCancelOrder = (orderId: string, orderNumber: string) => {
    setCancelModalData({
      orderId,
      orderNumber,
      bank: '',
      accountNumber: '',
      accountHolderName: ''
    });
    setShowCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setCancelModalData({
      orderId: '',
      orderNumber: '',
      bank: '',
      accountNumber: '',
      accountHolderName: ''
    });
  };

  const handleCancelRequest = async () => {
    try {
      // Backend-д цуцлах хүсэлт илгээх
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RequestCancellation($id: ID!) {
              requestCancellation(id: $id) {
                id
                status
                canCancel
              }
            }
          `,
          variables: {
            id: cancelModalData.orderId
          }
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('Cancellation request failed:', result.errors);
        alert('Цуцлах хүсэлт илгээхэд алдаа гарлаа');
        return;
      }

      alert('Цуцлах хүсэлт амжилттай илгээгдлээ');
      handleCancelModalClose();
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error sending cancellation request:', error);
      alert('Цуцлах хүсэлт илгээхэд алдаа гарлаа');
    }
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (status === 'CANCELLATION_REQUESTED') {
      return 'Төлөв: Цуцлах хүсэлт илгээсэн';
    }
    if (status === 'CANCELLED') {
      return 'Төлөв: Цуцлагдсан';
    }
    if (paymentStatus === 'COMPLETED' && status === 'CONFIRMED') {
      return 'Төлөв: Баталгаажсан';
    }
    if (paymentStatus === 'PENDING') {
      return 'Төлөв: Төлбөр хүлээгдэж байна';
    }
    return 'Төлөв: Тодорхойгүй';
  };

  const getTicketTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-500';
      case 'REGULAR':
        return 'bg-blue-500';
      case 'GENERAL_ADMISSION':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTicketTypeName = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'VIP тасалбар';
      case 'REGULAR':
        return 'Арын тасалбар';
      case 'GENERAL_ADMISSION':
        return 'Ерөнхий тасалбар';
      default:
        return 'Тасалбар';
    }
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
    console.error('Bookings error:', bookingsError);
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
                <p className="mb-[12px]">Захиалгын түүх авахад алдаа гарлаа. Дахин оролдоно уу.</p>
                <details className="text-[12px] text-red-300">
                  <summary className="cursor-pointer">Алдааны дэлгэрэнгүй</summary>
                  <pre className="mt-[8px] whitespace-pre-wrap">
                    {JSON.stringify(bookingsError, null, 2)}
                  </pre>
                </details>
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
          <h1 className="text-[32px] font-bold">Захиалагчийн мэдээлэл</h1>
        </div>

        <div className="flex gap-[24px]">
          <ProfileMenu />
          
          <div className="flex-1">

            {/* Orders List - Figma Design */}
            <div className="space-y-[16px]">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[12px] bg-[#111111] p-[20px]">
                  {/* Order Header */}
                  <div className="mb-[16px] flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[14px] text-gray-400">Захиалгын дугаар:</span>
                      <span className="text-[14px] font-medium">{order.orderNumber}</span>
                      <span className="text-[14px] text-gray-400">,</span>
                      <span className="text-[14px] text-gray-400">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-[12px]">
                      {order.status === 'CANCELLATION_REQUESTED' && (
                        <span className="text-[12px] text-yellow-400">
                          {getStatusText(order.status, order.paymentStatus)}
                        </span>
                      )}
                      {order.canCancel && order.status !== 'CANCELLED' && order.status !== 'CANCELLATION_REQUESTED' && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                          className="rounded-md bg-[#1a1a1a] px-[12px] py-[4px] text-[12px] font-medium text-white bg-[#2a2a2a] transition-colors shadow-sm border border-[#333333]"
                        >
                          Цуцлах
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Concert Information */}
                  <div className="mb-[16px]">
                    <div className="text-[16px] font-semibold text-white mb-[4px]">
                      {order.concert}
                    </div>
                    <div className="text-[14px] text-gray-300">
                      {order.artist}
                    </div>
                  </div>

                  {/* Ticket Details - Figma Style */}
                  <div className="space-y-[12px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[8px]">
                        <div className={`w-[8px] h-[8px] rounded-full ${getTicketTypeColor(order.ticketType)}`}></div>
                        <span className="text-[14px] text-white">
                          {getTicketTypeName(order.ticketType)} <span className="text-gray-400">({order.quantity})</span>
                        </span>
                      </div>
                      <div className="text-[14px] text-white">
                        {order.price} × {order.quantity} = {order.total}
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="mt-[16px] pt-[16px] border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-gray-400">Төлсөн дүн:</span>
                      <span className="text-[16px] font-semibold text-white">{order.total}</span>
                    </div>
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

      {/* Cancel Modal - Figma Design */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-[12px] p-[24px] w-[400px] max-w-[90vw]">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-[20px]">
              <h2 className="text-[18px] font-semibold text-white">Тасалбар цуцлах</h2>
              <button
                onClick={handleCancelModalClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Confirmation Message */}
            <div className="mb-[20px]">
              <p className="text-[14px] text-gray-300">
                {cancelModalData.orderNumber} тасалбараа цуцлахдаа итгэлтэй байна уу?
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-[16px] mb-[24px]">
              {/* Bank Selection */}
              <div>
                <label className="block text-[12px] text-gray-400 mb-[8px]">Банк</label>
                <select
                  value={cancelModalData.bank}
                  onChange={(e) => setCancelModalData({...cancelModalData, bank: e.target.value})}
                  className="w-full rounded-[8px] border border-gray-700 bg-[#0e0e0e] px-[12px] py-[10px] text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Сонгох</option>
                  <option value="khan-bank">Хаан банк</option>
                  <option value="golomt-bank">Голомт банк</option>
                  <option value="tenger-bank">Тэнгэр банк</option>
                  <option value="state-bank">Төрийн банк</option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-[12px] text-gray-400 mb-[8px]">Дансны №</label>
                <input
                  type="text"
                  value={cancelModalData.accountNumber}
                  onChange={(e) => setCancelModalData({...cancelModalData, accountNumber: e.target.value})}
                  placeholder="Дансны дугаар"
                  className="w-full rounded-[8px] border border-gray-700 bg-[#0e0e0e] px-[12px] py-[10px] text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-[12px] text-gray-400 mb-[8px]">Нэр</label>
                <input
                  type="text"
                  value={cancelModalData.accountHolderName}
                  onChange={(e) => setCancelModalData({...cancelModalData, accountHolderName: e.target.value})}
                  placeholder="Эзэмшигчийн нэр"
                  className="w-full rounded-[8px] border border-gray-700 bg-[#0e0e0e] px-[12px] py-[10px] text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCancelRequest}
              className="w-full rounded-[8px] bg-red-600 px-[16px] py-[12px] text-[14px] font-medium text-white hover:bg-red-700 transition-colors"
            >
              Цуцлах хүсэлт илгээх
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrdersPage;
