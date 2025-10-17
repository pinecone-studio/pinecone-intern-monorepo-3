'use client';

import { OrderFilter } from './orderFilter';
import { OrderItemCard } from './orderItemCard';

export const AdminOrderStyle = () => {
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
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRmYX4OqLGoOrbQXe2XFcDAbNphmu7dgkdQ&s',
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRmYX4OqLGoOrbQXe2XFcDAbNphmu7dgkdQ&s',
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
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRmYX4OqLGoOrbQXe2XFcDAbNphmu7dgkdQ&s',
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRmYX4OqLGoOrbQXe2XFcDAbNphmu7dgkdQ&s',
        },
        {
          id: 2,
          name: 'Latte',
          desc: 'Кофе сүүтэй',
          price: 9900,
          quantity: 2,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxRmYX4OqLGoOrbQXe2XFcDAbNphmu7dgkdQ&s',
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
