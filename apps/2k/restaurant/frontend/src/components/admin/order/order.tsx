'use client';

import { useState } from 'react';

import { OrderItemCard } from './orderItemCard';
import { OrderFilter } from './OrderFilter';




export const AdminOrderStyle = () => {
  const img = 'zurag';
  
  const [statusFilter, setStatusFilter] = useState('Бүгд');

  const mockOrders = [
    {
      id: 1,
      table: '1B',
      orderNumber: '#33678',
      time: '12:45',
      total: 25900,
      status: 'Хүлээгдэж буй',
      items: [
        { id: 1, name: 'Taso', desc: 'Шоколадтай бялуу', price: 15600, quantity: 3, image: img },
        { id: 2, name: 'Latte', desc: 'Кофе сүүтэй', price: 9900, quantity: 2, image: img },
      ],
    },
    {
      id: 2,
      table: '1B',
      orderNumber: '#33679',
      time: '12:50',
      total: 35600,
      status: 'Бэлэн',
      items: [
        { id: 1, name: 'Taso', desc: 'Шоколадтай бялуу', price: 15600, quantity: 3, image: img },
        { id: 2, name: 'Latte', desc: 'Кофе сүүтэй', price: 9900, quantity: 2, image: img },
        { id: 3, name: 'Espresso', desc: 'Эспрессо кофе', price: 10100, quantity: 1, image: img },
      ],
    },
  ];

  const filteredOrders = statusFilter === 'Бүгд' ? mockOrders : mockOrders.filter((order) => order.status === statusFilter);

  return (
    <div className="min-h-screen p-6 w-full max-w-[600px] ">
      <OrderFilter status={statusFilter} onStatusChange={setStatusFilter} />

      <div className="flex flex-col gap-5 mt-4">
        {filteredOrders.map((order) => (
          <OrderItemCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
