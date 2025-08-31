'use client';

import Link from 'next/link';
import { useState } from 'react';

export const GuestsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const guests = [
    { id: '0001', name: 'Baatar Erdenebat', hotel: 'Chinggis Khan Hotel', room: 'Economy Double Room, City View', guests: '1 Adult', date: 'Nov 5 - Nov 7', status: 'Booked' },
    { id: '0002', name: 'Tsetsenbayar Munkhbat', hotel: 'Chinggis Khan Hotel', room: 'Standard Twin Room, City View', guests: '2 Adults', date: 'Jan 10 - Jan 12', status: 'Completed' },
    { id: '0003', name: 'Munkhbayar Tserendorj', hotel: 'Chinggis Khan Hotel', room: 'Deluxe Twin Room, City View', guests: '2 Adults', date: 'Dec 15 - Dec 17', status: 'Completed' },
    { id: '0004', name: 'Chuluunbat Sukhbaatar', hotel: 'Chinggis Khan Hotel', room: 'Economy Double Room, City View', guests: '2 Adults', date: 'Jul 4 - Jul 6', status: 'Completed' },
    { id: '0005', name: 'Sarnai Erdenetsetseg', hotel: 'Chinggis Khan Hotel', room: 'Economy Double Room, City View', guests: '1 Adult', date: 'Dec 5 - Dec 7', status: 'Cancelled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesStatus = statusFilter ? guest.status === statusFilter : true;
    const matchesSearch = searchTerm ? guest.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="flex-1 backdrop-brightness-125 p-6 rounded-md">
      <h1 className="text-xl font-semibold mb-6">Guests</h1>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-md border bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-700"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm">
          <option value="">Status</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-transparent shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-transparent text-xs font-medium uppercase text-black">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Hotel</th>
              <th className="px-4 py-3">Rooms</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="border-t">
                <td className="px-4 py-3">{guest.id}</td>
                <Link href={`/admin/guestInfo/${guest.id}`} className="hover:underline">
                  <td className="px-4 py-3">{guest.name}</td>
                </Link>
                <td className="px-4 py-3">{guest.hotel}</td>
                <td className="px-4 py-3">{guest.room}</td>
                <td className="px-4 py-3">{guest.guests}</td>
                <td className="px-4 py-3">{guest.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(guest.status)}`}>{guest.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">Page 1 of 10</div>
    </main>
  );
};
