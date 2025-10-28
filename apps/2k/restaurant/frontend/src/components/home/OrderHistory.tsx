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
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-[#441500]">#{order.orderNumber}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">{order.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }).format(new Date(order.createdAt))}
                    </p>
                    <p className="text-lg font-bold text-[#441500]">{order.totalPrice?.toLocaleString()}₮</p>
                  </div>

                  {/* Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                            <span className="text-xs text-gray-500">x{item.selectCount || item.count}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && <span className="text-xs text-gray-500 flex items-center px-3 py-1.5">+{order.items.length - 3} more</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
