'use client';

import { GetBookingQuery, useGetBookingQuery } from '@/generated';
import { Link } from 'lucide-react';
import { useState } from 'react';

export type BookingType = NonNullable<GetBookingQuery['getBooking']>;

export const GuestsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading } = useGetBookingQuery();
  if (loading) return <div>Loading...</div>;
  console.log(data, 'booking');

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

  const filteredGuests = data?.getBooking?.filter((booking) => {
    const guest = booking?.user;
    if (!guest) return false;

    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesSearch = searchTerm ? booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true;

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
            {(filteredGuests ?? []).map((book) => {
              return (
                <tr key={book?._id} className="border-t">
                  <td className="px-4 py-3">{book?.user?._id.slice(0, 4)}</td>
                  <td className="px-4 py-3">
                    {book?.user?._id ? (
                      <Link href={`/admin/guestInfo/${book.user._id}`} className="hover:underline text-blue-600">
                        View Details
                      </Link>
                    ) : (
                      <p className="text-gray-400">No Info</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{book?.hotel?.hotelName}</td>
                  <td className="px-4 py-3">{book?.room?.roomType}</td>
                  <td className="px-4 py-3">{book?.user?._id[0]}</td>

                  <td className="px-4 py-3">{book?.checkIn.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(book?.status)}`}>{book?.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">Page 1 of 10</div>
    </main>
  );
};
