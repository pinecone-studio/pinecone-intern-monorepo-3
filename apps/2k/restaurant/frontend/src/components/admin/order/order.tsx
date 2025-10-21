'use client';

import { OrderFilter } from "./OrderFilter";
import { OrderItemCard } from "./OrderItemCard";





export const AdminOrderStyle = () => {

  const img = "zurag";
  const mockOrders = [
    {
      id: 1,
      table: '1B',
      orderNumber: '#33678',
      time: '12:45',
      total: 25900,
      items: [
        {
          id: 1,
          name: 'Taso',
          desc: 'Шоколадтай бялуу',
          price: 15600,
          quantity: 3,
          image: img,
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: img,
        },
      ],
    },

    {
      id: 1,
      table: '1B',
      orderNumber: '#33678',
      time: '12:45',
      total: 25900,
      items: [
        {
          id: 1,
          name: 'Taso',
          desc: 'Шоколадтай бялуу',
          price: 15600,
          quantity: 3,
          image: img,
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: img,
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: img,
        },
      ],
    },
  ];

  return (
    <div className="">
        
      <OrderFilter />

      {/* Mock orders-г map-аар card болгон харуулах */}
      <div className="flex flex-col gap-5">
        {mockOrders.map((order) => (
          <OrderItemCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
