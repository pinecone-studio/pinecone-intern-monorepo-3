'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { AddHotelRoom } from './AddRoom';
import { AddHotelGeneral } from './AddGeneral';
import { AddHotelAmenities } from './AddAminities';
import { AddAbout } from './AddAbout';
import { AddPolicies } from './AddPolicies';
import { AddQuestions } from './AddQuestions';
import { AddLocation } from './AddLocation';
import { AddImage } from './AddImages';
import { useRouter } from 'next/navigation';

export const AddHotel = () => {
  const router = useRouter();

  const backHotels = () => {
    router.push('/admin/hotels');
  };
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  return (
    <div className=" space-y-6 p-6">
      <div className="flex gap-3 items-center">
        {' '}
        <Button variant={'outline'} onClick={backHotels}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">Please add new Hotel</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AddHotelGeneral setHotelId={setHotelId} />
          <AddHotelRoom hotelId={hotelId} />
          <AddHotelAmenities hotelId={hotelId} />
          <AddAbout hotelId={hotelId} />
          <AddPolicies hotelId={hotelId} />
          <AddQuestions />
        </div>

        {/* right */}
        <div className="flex flex-col gap-4">
          <AddLocation hotelId={hotelId} />
          <AddImage hotelId={hotelId} />
        </div>
      </div>
    </div>
  );
};
