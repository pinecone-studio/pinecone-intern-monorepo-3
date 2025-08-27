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

type PropsType = {
  hotelId: string;
};
export const HotelDetail = ({ hotelId }: PropsType) => {
  const [backButton, setBackButton] = useState<string | null>(null);
  if (backButton) {
    return <HotelsPage />;
  }
  return (
    <div className=" space-y-6 p-6">
      <div className="flex gap-3 items-center">
        {' '}
        <Button
          variant={'outline'}
          onClick={() => {
            setBackButton('back');
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">{hotelId} Hotel name</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <UpcomingBookings />
          <RoomTypes />
          <Generalinfo />
          <Amenities />
          <AboutProperty />
          <Policies />
          <DetailsQuestions />
        </div>

        <div className="flex flex-col gap-4">
          <DetailLocation />
          <DetailImage hotelId={''} />
        </div>
      </div>
    </div>
  );
};

//
