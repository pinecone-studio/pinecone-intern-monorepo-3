'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetHotelByIdQuery } from '@/generated';

import { HotelsPage } from '../../../_Components/HotelsPage';
import { HotelType } from '../../../_Components/HotelsPage';
import { LeftColumn } from './LeftColumn';
import { RightColumn } from './RightColumn';

type PropsType = {
  hotelId: string;
};

// Helper function to map GraphQL data to type-safe HotelType
const mapHotelData = (data: any): HotelType | null => {
  if (!data?.getHotelById) return null;

  return {
    _id: data.getHotelById._id,
    hotelName: data.getHotelById.hotelName ?? '',
    description: data.getHotelById.description ?? '',
    location: data.getHotelById.location ?? '',
    starRating: data.getHotelById.starRating ?? '',
    image: data.getHotelById.image ?? [],
    userRating:
      data.getHotelById.userRating?.map((r: any) => ({
        rating: r?.rating ?? 0,
        comment: r?.comment ?? '',
        hotel: r?.hotel ?? '',
      })) ?? [],
    rooms:
      data.getHotelById.rooms?.map((r: any) => ({
        roomType: r?.roomType ?? '',
      })) ?? [],
  };
};
// Main HotelDetail component
export const HotelDetail = ({ hotelId }: PropsType) => {
  const { data } = useGetHotelByIdQuery({
    variables: { getHotelByIdId: hotelId },
  });

  const [backButton, setBackButton] = useState(false);

  if (backButton) return <HotelsPage />;

  const hotel = mapHotelData(data);

  return (
    <div className="space-y-6 p-6">
      {/* Header with back button */}
      <div className="flex gap-3 items-center">
        <Button variant="outline" onClick={() => setBackButton(true)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">{hotel?.hotelName}</h1>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LeftColumn hotel={hotel} />
        <RightColumn hotel={hotel} />
      </div>
    </div>
  );
};
