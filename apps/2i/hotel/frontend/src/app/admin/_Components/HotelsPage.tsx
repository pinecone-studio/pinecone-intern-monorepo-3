'use client';

import { TopBar } from '../_Components/TopBar';
import { useGetHotelQuery } from '@/generated';
import { useState } from 'react';
import { LocationSelectWithSearch } from './LocationSelect';
import { RoomTypeSelect } from './RoomSelected';
import { SelectStar } from './SelectStart';
import { UserRating } from './UserRating';
import { set } from 'cypress/types/lodash';

export const HotelsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room Type');
  const [selectedStar, setSelectedStar] = useState<string>('Star Rating');
  const [selectedRating, setSelectedRating] = useState<string>('User Rating');
  const { data, loading, error } = useGetHotelQuery();

  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>;
  if (data?.getHotel?.length === 0) return <p>No hotels found</p>;

  const filteredHotels = data?.getHotel.filter((hotel) => {
    let match = true;

    if (selectedLocation && selectedLocation !== 'All Locations' && selectedLocation !== 'Locations') {
      match = match && hotel?.location === selectedLocation;
    }
    if (selectedRoom && selectedRoom !== 'All Room' && selectedRoom !== 'Room Type') {
      match = match && (hotel?.rooms?.some((room) => room?.roomType === selectedRoom) ?? false);
    }

    if (selectedStar && selectedStar !== 'Star Rating' && selectedStar !== 'All') {
      match = match && hotel?.starRating === selectedStar;
    }

    if (selectedRating && selectedRating !== 'User Rating') {
      if (!hotel?.userRating || hotel.userRating.length === 0) return false;

      const avgRating = hotel.userRating.reduce((sum, r) => sum + (r?.rating ?? 0), 0) / hotel.userRating.length;

      match = match && avgRating >= Number(selectedRating);
    }

    return match;
  });

  return (
    <main className="flex-1 bg-gray-50 p-6">
      <TopBar />

      <div className="flex items-center gap-3 mb-4">
        <input type="text" placeholder="Search" className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />

        <LocationSelectWithSearch onChange={(_val) => setSelectedLocation(_val)} />

        <RoomTypeSelect onChange={(_val) => setSelectedRoom(_val)} />

        <SelectStar onChange={(_val) => setSelectedStar(_val)} />

        <UserRating onChange={(_val) => setSelectedRating(_val)} />
      </div>

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
            {filteredHotels.map((hotel) => (
              <tr key={hotel?._id} className="border-t">
                <td className="px-4 py-3">{hotel?._id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {/* <Image src={hotel?.image[0]} alt="hotelName" width={40} height={40} className="rounded-md object-cover" /> */}
                  {hotel?.hotelName}
                </td>
                <td className="px-4 py-3 space-x-2">
                  {hotel?.rooms.map((room, i) => (
                    <span key={i} className="inline-block rounded-md border px-2 py-1 text-xs">
                      {room?.roomType}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">⭐ {hotel?.starRating}</td>
                <td className="px-4 py-3">{hotel?.userRating.map((el) => el?.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
