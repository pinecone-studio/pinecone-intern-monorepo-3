'use client';

import { AboutProperty } from './DetailsAbout';
import { Amenities } from './Amenities';
import { Generalinfo } from './Generalinfo';
import { Policies } from './Policies';
import { RoomTypes } from './RoomTypes';
import { UpcomingBookings } from './UpcomingBookings';
import { DetailLocation } from './DetailLocation';
import { DetailImage } from './DetailsImage';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { HotelsPage } from './HotelsPage';
import { DetailsQuestions } from './DetailsQuestions';
import { useGetHotelByIdQuery } from '@/generated';
import { HotelType } from './HotelsPage';

type PropsType = {
  hotelId: string;
};

export const HotelDetail = ({ hotelId }: PropsType) => {
  const { data } = useGetHotelByIdQuery({
    variables: { getHotelByIdId: hotelId },
  });

  const [backButton, setBackButton] = useState<boolean>(false);

  if (backButton) {
    return <HotelsPage />;
  }

  // GraphQL response-г type-safe болгож default value өгөх
  const hotel: HotelType | null = data?.getHotelById
    ? {
        _id: data.getHotelById._id,
        hotelName: data.getHotelById.hotelName ?? '',
        description: data.getHotelById.description ?? '',
        location: data.getHotelById.location ?? '',
        starRating: data.getHotelById.starRating ?? '',
        image: data.getHotelById.image ?? [],
        userRating:
          data.getHotelById.userRating?.map((r) => ({
            rating: r?.rating ?? 0,
            comment: r?.comment ?? '',
            hotel: r?.hotel ?? '',
          })) ?? [],
        rooms:
          data.getHotelById.rooms?.map((r) => ({
            roomType: r?.roomType ?? '',
          })) ?? [],
      }
    : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-3 items-center">
        <Button variant={'outline'} onClick={() => setBackButton(true)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">{hotel?.hotelName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <UpcomingBookings />
          <RoomTypes />
          <Generalinfo data={hotel} />
          <Amenities />
          <AboutProperty />
          <Policies />
          <DetailsQuestions />
        </div>

        {/* right */}
        <div className="flex flex-col gap-4">
          <DetailLocation />
          {hotel && <DetailImage hotelData={hotel} />}
        </div>
      </div>
    </div>
  );
};
