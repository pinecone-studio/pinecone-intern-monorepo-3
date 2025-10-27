'use client';

import { useState } from 'react';

import { OrderItemCard } from './orderItemCard';
import { FoodOrder, useGetAllOrdersQuery } from '@/generated';
import { OrderFilter } from './orderFilter';


export const AdminOrderStyle = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data, refetch } = useGetAllOrdersQuery();

  console.log("selectedDate", selectedDate);
  

  const [statusFilter, setStatusFilter] = useState('Бүгд');

  console.log("statusFilter", statusFilter);

  const filteredOrders = data?.GetAllOrders.filter((order: FoodOrder) => {order.status
    if (statusFilter === 'Бүгд') return true;
    return order.status === statusFilter;
  })

  console.log("filteredOrders", filteredOrders);
  
  

  // const mockOrders = [
  //   {
  //     id: 1,
  //     table: '1B',
  //     orderNumber: '#33678',
  //     time: '12:45',
  //     total: 25900,
  //     status: 'Хүлээгдэж буй',
  //     items: [
  //       { id: 1, name: 'Taso', desc: 'Шоколадтай бялуу', price: 15600, quantity: 3, image: img },
  //       { id: 2, name: 'Latte', desc: 'Кофе сүүтэй', price: 9900, quantity: 2, image: img },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     table: '1B',
  //     orderNumber: '#33679',
  //     time: '12:50',
  //     total: 35600,
  //     status: 'Бэлэн',
  //     items: [
  //       { id: 1, name: 'Taso', desc: 'Шоколадтай бялуу', price: 15600, quantity: 3, image: img },
  //       { id: 2, name: 'Latte', desc: 'Кофе сүүтэй', price: 9900, quantity: 2, image: img },
  //       { id: 3, name: 'Espresso', desc: 'Эспрессо кофе', price: 10100, quantity: 1, image: img },
  //     ],
  //   },
  // ];

  // const filteredOrders = statusFilter === 'Бүгд' ? mockOrders : mockOrders.filter((order) => order.status === statusFilter);

  return (
    <div className="min-h-screen p-6 w-full max-w-[600px] ">
      <OrderFilter status={statusFilter} onStatusChange={setStatusFilter} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />

      <div className="flex flex-col gap-5 mt-4">
        {data?.GetAllOrders.map((order: FoodOrder) => (
          <OrderItemCard key={order.id} order={order} refetch={refetch} />
        ))}
      </div>
    </div>
  );
};
