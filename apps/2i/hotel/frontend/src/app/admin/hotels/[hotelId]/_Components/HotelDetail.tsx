'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetHotelByIdQuery } from '@/generated';
// import { LeftColumn } from './LeftColumn';
// import { RightColumn } from './RightColumn';
import { useRouter } from 'next/navigation';

type PropsType = {
  hotelId: string;
};

export type HotelType = {
  _id: string;
  hotelName: string;
  description: string;
  location: string;
  starRating: string;
  image: string[];
  userRating: {
    rating: number;
    comment: string;
    hotel: string;
  }[];
  rooms: {
    roomType: string;
    price: number;
    availability: number;
  }[];
};

export const HotelDetail = ({ hotelId }: PropsType) => {
  const { data } = useGetHotelByIdQuery({ variables: { getHotelByIdId: hotelId } });

  const router = useRouter();

  const backHotels = () => {
    router.push('/admin/hotels');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-3 items-center">
        <Button variant="outline" onClick={backHotels}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]">{data?.getHotelById?.hotelName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* <LeftColumn hotel={data?.getHotelById} />
        <RightColumn hotel={data?.getHotelById} /> */}
      </div>
    </div>
  );
};
