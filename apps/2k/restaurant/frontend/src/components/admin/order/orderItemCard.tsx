'use client';

import { useState } from 'react';
import { SelectStatus } from './SelectStatus';
import { FoodOrder, FoodOrderStatus, FoodType, GetAllOrdersQuery, useUpdateOrderMutation } from '@/generated';
import { ApolloQueryResult } from '@apollo/client';
import dayjs from 'dayjs';

type OrderItemCardProps = {
  food: FoodType;
  quantity?: number;
};

export const OrderItemCard = ({ order, refetch }: { order: FoodOrder; refetch: () => Promise<ApolloQueryResult<GetAllOrdersQuery>> }) => {
  console.log('order', order);

  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();

  type StatusInfo = { color: string; label: string };

  const statusUi: Record<FoodOrderStatus, StatusInfo> = {
    PENDING: { color: 'bg-yellow-400', label: 'Хүлээгдэж байна' },
    INPROGRESS: { color: 'bg-blue-400', label: 'Хийгдэж байна' },
    COMPLETED: { color: 'bg-gray-400', label: 'Дууссан' },
    SERVED: { color: 'bg-green-400', label: 'Бэлэн' },
  };

  // default status
  const [status, setStatus] = useState<FoodOrderStatus>(order.status as any);

  const toggleOrderDetail = () => setIsOrderDetail((prev) => !prev);

  const handleSave = async () => {
    setIsOrderDetail((prev) => !prev);
    await updateOrder({ variables: { input: { order: order.id, status } } });
    await refetch();
  };

  console.log('status', status);

  console.log('statusUi', statusUi[order.status].label);

  return (
    <div className="max-w-[600px]">
      <div className="border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold text-[#441500]">#{order.orderNumber}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusUi[status].color}`}></span>
                {statusUi[status].label}
              </span>
            </div>
            <p className="text-sm text-gray-600">Ширээ: {order.tableId}</p>
          </div>
          <p className="text-sm text-gray-500">🕒 {dayjs(order.createdAt).format('HH:mm, MMM D')}</p>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Toggle дэлгэрэнгүй */}
        {isOrderDetail && (
          <div className="flex flex-col gap-3 pt-2">
            {order.foodOrderItems.map((item: OrderItemCardProps) => (
              <div key={item.food.id} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-xl p-3 border border-gray-100">
                {/* Image */}
                <div className="relative">
                  <img src={item.food.image ?? ''} alt={item?.food.image ?? ''} className="w-[70px] h-[70px] rounded-xl object-cover border border-gray-200" />
                  <div className="absolute bottom-1 right-1 bg-white/90 text-gray-700 text-[12px] px-2 py-[1px] rounded-full border border-gray-200">x{item.quantity}</div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 ml-3">
                  <p className="font-medium text-gray-800 text-[15px]">{item.food.name}</p>
                  {/* <p className="text-[13px] text-gray-500 mt-[2px]">{item.desc}</p> */}
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-gray-800">{(item.food?.price ?? 0).toLocaleString()}₮</p>
                </div>
              </div>
            ))}

            <div className="h-[1px] w-full bg-gray-100"></div>
          </div>
        )}

        {/* Total + Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-base">Нийт дүн:</p>
            <p className="font-bold text-xl text-[#441500]">{order.totalPrice.toLocaleString()}₮</p>
          </div>

          <div className="flex justify-end gap-2 items-center">
            {isOrderDetail ? (
              <div className="flex gap-2 items-center">
                <SelectStatus value={status} onValueChange={(value) => setStatus(value as FoodOrderStatus)} isAll={false} />
                <button onClick={handleSave} className="rounded-lg bg-[#441500] text-white px-6 py-2.5 hover:bg-amber-900 transition-colors font-medium">
                  Хадгалах
                </button>
              </div>
            ) : (
              // Дэлгэрэнгүй хаалттай үед status-г circle + текстээр харуулах
              <button onClick={toggleOrderDetail} className="rounded-lg border-2 border-[#441500] px-6 py-2.5 flex items-center gap-2 text-[#441500] hover:bg-amber-50 transition-colors font-medium">
                Дэлгэрэнгүй харах
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
