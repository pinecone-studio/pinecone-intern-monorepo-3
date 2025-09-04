'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetHotelByIdQuery } from '@/generated';

import { HotelsPage } from '../../../_Components/HotelsPage';
import { LeftColumn } from './LeftColumn';
import { RightColumn } from './RightColumn';
import { mapHotelData } from './HotelType';

type PropsType = {
  hotelId: string;
};

export const HotelDetail = ({ hotelId }: PropsType) => {
  const { data } = useGetHotelByIdQuery({ variables: { getHotelByIdId: hotelId } });
  const [backButton, setBackButton] = useState(false);

  if (backButton) return <HotelsPage />;

  const hotel = mapHotelData(data);

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-3 items-center">
        <Button variant="outline" onClick={() => setBackButton(true)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">{hotel?.hotelName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LeftColumn hotel={hotel} />
        <RightColumn hotel={hotel} />
      </div>
    </div>
  );
};
