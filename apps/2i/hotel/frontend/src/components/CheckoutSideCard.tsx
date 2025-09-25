import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export const CheckoutSideCard = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="">
        <div className="relative w-full h-56 border">
          <Image fill src={''} alt="room image" className="absolute object-cover" />
        </div>

        <div className="order-2 md:order-1 md:col-span-3 p-6 md:p-7">
          <div className="text-xs tracking-wide uppercase text-slate-500 mb-1">My Booking</div>

          <h3 className="text-slate-900 font-bold text-lg leading-snug">Flower Hotel Ulaanbaatar</h3>

          <p className="text-slate-600 mt-1 mb-3 text-sm">Sükhbaatar District, 1st Khoroo, Ulaanbaatar, Mongolia </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="ml-1 inline-flex items-center rounded-full bg-[#2563EB] text-white px-2 py-0.5 text-xs font-semibold ">8.9</span>
            Excellent{' '}
          </div>
          <div className="my-4 border-t border-slate-200" />

          <div className="flex flex-col gap-3 mb-4">
            <div>
              <p className="text-xs text-slate-500">Check in</p>
              <p className="text-sm font-medium text-slate-900">Mon, Jul 3, 1:00pm</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Check out</p>
              <p className="text-sm font-medium text-slate-900">Tue, Jul 4, 11:00am</p>
            </div>
            <div className="my-4 border-t border-slate-200" />
            <p className="text-sm   ">Standard Room, City View</p>
            <div className="flex justify-between">
              <div>
                <p className="flex items-center text-sm gap-2">
                  <Zap className="w-4 h-4" />1 Queen
                </p>
                <p className="flex items-center text-sm gap-2">
                  <Zap className="w-4 h-4" />
                  Breakfast included
                </p>
              </div>
              <div>
                {' '}
                <p className="flex items-center text-sm gap-2">
                  <Zap className="w-4 h-4" />
                  Non Smoking
                </p>
                <p className="flex items-center text-sm gap-2">
                  <Zap className="w-4 h-4" />
                  Pet friendly
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-2 p-6">
        <h1 className=" font-bold">Price Detail</h1>
        <div className="flex justify-between">
          <div>
            <p className="text-sm">1 room × 1 night</p>
            <p className="text-muted-foreground text-sm">$78.30 per night</p>
          </div>
          <p>USD 8</p>
        </div>

        <div className="my-4 border-t border-slate-200" />
        <div className="flex justify-between">
          <p>Total price</p>
          <p className="">USD 81.00</p>
        </div>
      </Card>
    </div>
  );
};
