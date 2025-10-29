'use client';

import { useState } from 'react';

import { OrderItemCard } from './orderItemCard';
import { FoodOrder, useGetAllOrdersQuery } from '@/generated';
import { OrderFilter } from './OrrderFilter';

const OrderItemCardSkeleton = () => (
  <div className="border border-gray-200 rounded-xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="h-6 w-16 bg-gray-200 rounded" />
    </div>
    <div className="border-t border-gray-200" />
    <div className="flex justify-between items-center">
      <div className="h-5 w-24 bg-gray-200 rounded" />
      <div className="h-7 w-20 bg-gray-200 rounded" />
    </div>
    <div className="border-t border-gray-200" />
    <div className="flex justify-end">
      <div className="h-10 w-32 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

export const AdminOrderStyle = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data, refetch, loading } = useGetAllOrdersQuery();

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
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <OrderItemCardSkeleton key={i} />
            ))}
          </>
        ) : (
          filteredOrders.map((order: FoodOrder) => <OrderItemCard key={order.id} order={order} refetch={refetch} />)
        )}
      </div>
    </div>
  );
};
