import React from 'react';
import { MyBookingsQuery } from '@/generated';
import { Clock } from 'lucide-react';

type Booking = MyBookingsQuery['myBookings'][0];

interface OrderCardProps {
  booking: Booking;
}

const OrderCard: React.FC<OrderCardProps> = ({ booking }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Баталгаажсан';
      case 'PENDING':
        return 'Хүлээгдэж буй';
      case 'CANCELLED':
        return 'Цуцлагдсан';
      default:
        return status;
    }
  };

  return (
    <div className="rounded-[12px] bg-[#111111] p-[24px]">
      <div className="mb-[16px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <span className="text-[14px] text-gray-400">Захиалгын дугаар: #{booking.id.slice(-6)}</span>
          <div className="flex items-center gap-[4px] text-[14px] text-gray-400">
            <Clock size={16} />
            <span>{new Date(booking.createdAt).toLocaleDateString('mn-MN')}</span>
          </div>
        </div>
        <div className="text-[14px]">
          <span className="text-gray-400">Төлөв: </span>
          <span className={`${booking.status === 'CONFIRMED' ? 'text-green-400' : booking.status === 'CANCELLED' ? 'text-red-400' : 'text-yellow-400'}`}>{getStatusLabel(booking.status)}</span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className={`h-[8px] w-[8px] rounded-full ${booking.ticketCategory.type === 'VIP' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
            <span className="text-[14px]">{booking.ticketCategory.type} тасалбар</span>
          </div>
          <div className="text-[14px] text-gray-300">
            {booking.ticketCategory.unitPrice.toLocaleString()}₮ x {booking.quantity}
          </div>
        </div>
      </div>

      <div className="mt-[16px] border-t border-gray-700 pt-[16px]">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-400">Төлсөн дүн</span>
          <span className="text-[18px] font-semibold">{booking.totalPrice.toLocaleString()}₮</span>
        </div>
      </div>

      {booking.status !== 'CANCELLED' && (
        <div className="mt-[16px] text-right">
          <button className="rounded-[8px] bg-red-800 px-[16px] py-[8px] text-[12px] text-white hover:bg-red-700 transition-colors">Цуцлах</button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
