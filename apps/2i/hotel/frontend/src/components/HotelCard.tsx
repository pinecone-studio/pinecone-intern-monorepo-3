'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GetHotelQuery } from '@/generated';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export type HotelType = NonNullable<GetHotelQuery['getHotel']>;

type Props = {
  hotels?: HotelType;
};

export const HotelCard = ({ hotels }: Props) => {
  const router = useRouter();
  const hotelHandle = (id: string) => {
    router.push(`/hotel/${id}`);
  };
  return (
    <div className="mx-auto max-w-[1280px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Hotels</h2>
        <Button variant={'outline'} className="border">
          View All
        </Button>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {hotels?.map((hotel) => (
          <Card
            key={hotel?.hotelName}
            className="overflow-hidden rounded-md cursor-pointer bg-white shadow-sm transition hover:shadow-md"
            onClick={() => {
              if (hotel?._id) {
                hotelHandle(hotel._id);
              }
            }}
          >
            <div className="relative w-full h-[216px]">
              <Image src={hotel?.image[0] ?? '/placeholder.png'} alt={hotel?.hotelName ?? 'Room image'} fill className="object-cover " />
            </div>

            <div className="flex flex-col gap-4 p-4">
              <h3 className="font-inter font-bold text-[16px]">{hotel?.hotelName}</h3>

              <div className="flex items-center gap-1 ">
                {hotel?.starRating}
                <Star className="w-[16px] h-[16px] fill-yellow-300 text-yellow-300" />
              </div>
              <div className="flex flex-wrap gap-2">
                {hotel?.amenities.map((el, index) => {
                  return (
                    <Badge key={index} variant="outline">
                      {el}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
