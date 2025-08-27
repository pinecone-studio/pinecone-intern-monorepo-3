'use client';

import Image from 'next/image';
import { TopBar } from '../_Components/TopBar';
import { useState } from 'react';
import { HotelDetail } from './HotelDetail';
import { useApolloClient } from '@apollo/client';
import { useGetHotelQuery } from '@/generated';

export const HotelsPage = () => {
  const hotels = [
    {
      id: '0001',
      name: 'Toyoko Inn Ulaanbaatar',
      image: '/hotel1.jpg',
      stars: 5,
      rating: '8.4/10',
      rooms: ['Single', 'Deluxe', 'Standard'],
    },
    {
      id: '0002',
      name: 'Edelweiss Art Hotel',
      image: '/hotel2.jpg',
      stars: 5,
      rating: '8.6/10',
      rooms: ['Single', 'Deluxe', 'Standard'],
    },
    {
      id: '0003',
      name: 'Flower Hotel Ulaanbaator',
      image: '/hotel3.jpg',
      stars: 5,
      rating: '8.2/10',
      rooms: ['Single', 'Deluxe', 'Standard'],
    },
    {
      id: '0004',
      name: 'Hotel Nine',
      image: '/hotel4.jpg',
      stars: 5,
      rating: '8.1/10',
      rooms: ['Single', 'Deluxe', 'Standard'],
    },
  ];
  // const { data, loading, error } = useGetHotelQuery();
  // console.log(data, 'data');

  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  if (selectedHotelId) {
    return <HotelDetail hotelId={selectedHotelId} />;
  }
  return (
    <main className="flex-1 bg-gray-50 p-6">
      <TopBar />
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <input type="text" placeholder="Search" className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option>Rooms</option>
        </select>
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option>Star Rating</option>
        </select>
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option>User Rating</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Rooms</th>
              <th className="px-4 py-3">Stars Rating</th>
              <th className="px-4 py-3">User Rating</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-t">
                <td className="px-4 py-3">{hotel.id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <Image src={hotel.image} alt={hotel.name} width={40} height={40} className="rounded-md object-cover" />
                  <button onClick={() => setSelectedHotelId(hotel.id)}>{hotel.name}</button>
                </td>
                <td className="px-4 py-3 space-x-2">
                  {hotel.rooms.map((room, i) => (
                    <span key={i} className="inline-block rounded-md border px-2 py-1 text-xs">
                      {room}
                    </span>
                  ))}
                  <span className="inline-block rounded-md border px-2 py-1 text-xs">+5</span>
                </td>
                <td className="px-4 py-3">⭐ {hotel.stars}</td>
                <td className="px-4 py-3">{hotel.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
function useApolloQuery(): { data: any; loading: any; error: any } {
  throw new Error('Function not implemented.');
}
