'use client';

import { TopBar } from '../_Components/TopBar';
import { useGetHotelQuery } from '@/generated';
import { useState } from 'react';
import { LocationSelectWithSearch } from './LocationSelect';
import { RoomTypeSelect } from './RoomSelected';
import { SelectStar } from './SelectStart';
import { UserRating } from './UserRating';

type HotelType = {
  __typename?: 'Hotel' | undefined;
  _id: string;
  hotelName: string;
  description?: string | null | undefined;
  location: string;
  starRating: string;
  image: string[];
  userRating: ({
    __typename?: 'UserRating' | undefined;
    rating?: number | null | undefined;
    comment?: string | null | undefined;
    hotel?: string | null | undefined;
  } | null)[];
  rooms: ({
    __typename?: 'Room' | undefined;
    roomType?: string | null | undefined;
    price?: number | null | undefined;
    availability?: number | null | undefined;
  } | null)[];
};

export const HotelsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room Type');
  const [selectedStar, setSelectedStar] = useState<string>('Star Rating');
  const [selectedRating, setSelectedRating] = useState<string>('User Rating');
  const { data } = useGetHotelQuery();

  console.log(data);

  const getAvgRating = (hotel: HotelType): number => {
    if (!hotel.userRating || hotel.userRating.length === 0) return 0;
    return hotel.userRating.reduce((sum, r) => sum + (r?.rating ?? 0), 0) / hotel.userRating.length;
  };

  const matchesFilters = (hotel: HotelType | null): boolean => {
    if (!hotel) return false;

    return matchesLocation(hotel) && matchesRoom(hotel) && matchesStar(hotel) && matchesRating(hotel);
  };

  const matchesLocation = (hotel: HotelType) => !selectedLocation || selectedLocation === 'All Locations' || selectedLocation === 'Locations' || hotel.location === selectedLocation;

  const matchesRoom = (hotel: HotelType) => !selectedRoom || selectedRoom === 'All Room' || selectedRoom === 'Room Type' || (hotel.rooms?.some((room) => room?.roomType === selectedRoom) ?? false);

  const matchesStar = (hotel: HotelType) => !selectedStar || selectedStar === 'Star Rating' || selectedStar === 'All' || hotel.starRating === selectedStar;

  const matchesRating = (hotel: HotelType) => !selectedRating || selectedRating === 'User Rating' || getAvgRating(hotel) >= Number(selectedRating);

  const hotelsArray: any[] = Array.isArray(data?.getHotel) ? data.getHotel : [];
  const filteredHotels = hotelsArray?.filter(matchesFilters);

  const renderRooms = (rooms: HotelType['rooms']) =>
    rooms?.filter(Boolean).map((room, i) => (
      <span key={i} className="inline-block rounded-md border px-2 py-1 text-xs">
        {room?.roomType}
      </span>
    ));

  const renderRatings = (userRating: HotelType['userRating']) =>
    userRating
      ?.filter(Boolean)
      .map((r) => r?.rating)
      ?.filter(Boolean)
      .join(', ');

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
            {filteredHotels.map((hotel) => {
              if (!hotel) return null;

              return (
                <tr key={hotel._id} className="border-t">
                  <td className="px-4 py-3">{hotel._id}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {/* <Image src={hotel.image[0]} alt="hotelName" width={40} height={40} className="rounded-md object-cover" /> */}
                    {hotel.hotelName}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <td className="px-4 py-3 space-x-2">{renderRooms(hotel.rooms)}</td>
                  </td>
                  <td className="px-4 py-3">⭐ {hotel.starRating}</td>
                  <td className="px-4 py-3">{renderRatings(hotel.userRating)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};
