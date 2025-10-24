'use client';

import { useState } from 'react';

import { SelectStatus } from './SelectStatus';
import { OrderItemType, typeOrderItemType } from '@/types/orderType';


export const OrderItemCard = ({ order }: { order: OrderItemType }) => {
  
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [status, setStatus] = useState(order?.status || 'Хүлээгдэж буй'); // default status
  const toggleOrderDetail = () => setIsOrderDetail((prev) => !prev);

  // status-д тохирсон өнгө
  const statusColors: Record<string, string> = {
    'Бэлэн': 'bg-green-400',
    'Хүлээгдэж буй': 'bg-yellow-400',
    'Хийгдэж буй': 'bg-blue-400',
    'Дууссан': 'bg-gray-400',
  };

  return (
    <div className="max-w-[600px]">
      <div className="flex flex-col gap-3 p-4 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-[18px] font-semibold text-gray-800">{order.table}</p>
            <p className="text-[18px] text-gray-500">{order.orderNumber}</p>
          </div>
          <p className="text-[13px] text-gray-400">🕒 {order.time}</p>
        </div>

        <div className="h-[1px] bg-gray-100"></div>

        {/* Toggle дэлгэрэнгүй */}
        {isOrderDetail && (
          <div className="flex flex-col gap-3 pt-2">
            {order.items.map((item: typeOrderItemType) => (
              <div key={item.id} className="flex items-center justify-between p-3 transition-all duration-200 border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-xl">
                {/* Image */}
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-[70px] h-[70px] rounded-xl object-cover border border-gray-200" />
                  <div className="absolute bottom-1 right-1 bg-white/90 text-gray-700 text-[12px] px-2 py-[1px] rounded-full border border-gray-200">x{item.quantity}</div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 ml-3">
                  <p className="font-medium text-gray-800 text-[15px]">{item.name}</p>
                  <p className="text-[13px] text-gray-500 mt-[2px]">{item.desc}</p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-gray-800">{item.price.toLocaleString()}₮</p>
                </div>
              </div>
            ))}

            <div className="h-[1px] w-full bg-gray-100"></div>
          </div>
        )}

        {/* Total + Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-[14px]">Нийлбэр дүн:</p>
            <p className="font-semibold text-[18px] text-gray-800">{order.total.toLocaleString()}₮</p>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isOrderDetail ? (
              <div className="flex items-center gap-2">
                <SelectStatus value={status} onValueChange={setStatus} isAll={false} />
                <button
                  onClick={toggleOrderDetail}
                  className="px-4 py-2 text-white transition bg-gray-800 border border-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Хадгалах
                </button>
              </div>
            ) : (
              // Дэлгэрэнгүй хаалттай үед status-г circle + текстээр харуулах
              <button
                onClick={toggleOrderDetail}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 transition border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className={`inline-block w-2 h-2 rounded-full ${statusColors[status]}`}></span>
                {status}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};