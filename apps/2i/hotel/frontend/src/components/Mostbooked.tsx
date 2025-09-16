'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { CircleParking, Flower, Star, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Most = {
  name: string;
  image: string;

  ratingScore?: number;
  ratingLabel: string;
  wifi?: string;
  spa?: string;
  parking?: string;
};

type Props = {
  most: Most[];
};

export const MostBooked = ({ most }: Props) => {
  return (
    <div className="mx-auto max-w-[1280px] p-6">
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-xl font-semibold mb-4">Most booked hotels in Mongolia in past month</h2>
        <Button variant={'outline'} className="border">
          View All
        </Button>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {most.map((hotel) => (
          <Card key={hotel.name} className="overflow-hidden rounded-md bg-white shadow-sm transition hover:shadow-md">
            <div className="relative w-full h-[216px]">
              <Image src={hotel.image} alt={hotel.name} fill className="object-cover " />
            </div>

            <div className="p-4 flex flex-col gap-4">
              <div>
                <h3 className="font-inter font-bold text-[16px]   ">{hotel.name}</h3>

                <div className="flex items-center gap-1 ">
                  <Star className="h-4 w-4 text-[#F97316] fill-[#F97316] " />
                  <Star className="h-4 w-4 text-[#F97316] fill-[#F97316]" />
                  <Star className="h-4 w-4 text-[#F97316] fill-[#F97316]" />
                  <Star className="h-4 w-4 text-[#F97316] fill-[#F97316]" />
                </div>
              </div>
              {/* Amenities */}
              <div className="space-y-1 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" /> <span>WiFi: {hotel.wifi}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Flower className="h-4 w-4" /> <span>Spa: {hotel.spa}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CircleParking className="h-4 w-4" /> <span>{hotel.parking}</span>
                </div>
              </div>

              <div className=" flex items-center gap-2 ">
                <p className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white bg-blue-600">{hotel.ratingScore} </p>{' '}
                <p className="font-inter text-[14px] font-semibold">{hotel.ratingLabel}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
