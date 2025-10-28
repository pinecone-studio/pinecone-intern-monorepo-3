'use client';

import { useState } from 'react';

import { OrderItemCard } from './orderItemCard';
import { FoodOrder, useGetAllOrdersQuery } from '@/generated';
import { OrderFilter } from './OrrderFilter';

export const AdminOrderStyle = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data, refetch } = useGetAllOrdersQuery();

  const [statusFilter, setStatusFilter] = useState('Бүгд');

  const filteredOrders = (data?.GetAllOrders || []).filter((order: FoodOrder) => {
    // Status filter
    const matchesStatus = statusFilter === 'Бүгд' || order.status === (statusFilter as any);

    // Date filter (same day comparison)
    const matchesDate = selectedDate
      ? (() => {
          try {
            const orderDate = order.createdAt ? new Date(order.createdAt as any) : null;
            if (!orderDate) return false;
            return orderDate.toDateString() === selectedDate.toDateString();
          } catch {
            return false;
          }
        })()
      : true;

    return matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen p-6 w-full max-w-[600px] ">
      <OrderFilter status={statusFilter} onStatusChange={setStatusFilter} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />

      <div className="flex flex-col gap-5 mt-4">
        {filteredOrders.map((order: FoodOrder) => (
          <OrderItemCard key={order.id} order={order} refetch={refetch} />
        ))}
      </div>
    </div>
  );
};
