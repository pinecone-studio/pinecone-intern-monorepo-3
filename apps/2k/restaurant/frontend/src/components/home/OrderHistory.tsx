'use client';
import { useEffect, useState } from 'react';
import { Header } from '../Header';

export const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  return (
    <div>
      <Header />
      <div className="text-center">
        <p className="font-medium text-[#441500] pt-5 text-[20px]">Захиалгын түүх</p>
        <div className="flex w-full justify-center pt-4">
          <div className="w-[414px] flex flex-col gap-4 justify-start rounded-md p-4">
            {orders.length === 0 ? (
              <p>Захиалга олдсонгүй</p>
            ) : (
              orders.map((order) => (
                <div key={order.orderId} className="w-full border-[1px] rounded-md bg-muted p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-[#441500] font-bold text-[20px]">#{order.orderNumber}</p>
                    <div className="w-[120px] h-[20px] border-[1px] bg-white rounded-md flex items-center justify-center">
                      <p className="text-[12px]">{order.status}</p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-[10px] flex items-end">
                      {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }).format(new Date(order.createdAt))}
                    </p>
                    <p>{order.totalPrice}₮</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
