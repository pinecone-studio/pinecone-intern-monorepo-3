'use client';

// import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Users, Search, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useState } from 'react';

export const SearchCard = () => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [adults, setAdults] = useState<number>(1);
  const dateLabel = range?.from && range?.to ? `${format(range.from, 'MMM d')} – ${format(range.to, 'MMM d')}` : range?.from ? format(range.from, 'MMM d') : 'Select dates';

  return (
    <div className="absolute inset-x-0 top-[212px] flex justify-center px-4">
      <div className="flex w-[1160px] items-end justify-between gap-4 rounded-xl border-[3px] border-[#FFB700] bg-white p-3 shadow-xl">
        {/* Dates */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="dates" className="px-1">
            Dates
          </Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="border-2 border-gray-200">
              <Button id="dates" variant="outline" className="w-[360px] justify-between font-normal">
                <div className="inline-flex items-center gap-2 truncate">
                  <span className="truncate">{dateLabel}</span>
                </div>
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3" align="start">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={range}
                captionLayout="dropdown" // month/year dropdown
                onSelect={(r) => {
                  setRange(r);
                  // Хоёр огноо хоёулаа сонгогдсон үед popup-оо хаана
                  if (r?.from && r?.to) setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}

        <div className="flex flex-col gap-1">
          <Label htmlFor="guests" className="px-1">
            Guest
          </Label>
          <Popover>
            <PopoverTrigger asChild className="w-[500px]">
              <div className="flex   items-center justify-between rounded-lg border border-gray-300 px-4 py-2 bg-white cursor-pointer">
                <span className="text-sm text-gray-700">
                  {adults} traveller{adults > 1 ? 's' : ''}, 1 room
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] rounded-lg p-4">
              <h1 className="mb-4 font-semibold text-gray-800">Travels</h1>

              {/* Adult row */}
              <div className="flex items-center justify-between ">
                <p className="text-sm">Adult</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-8 h-8 p-0 border" onClick={() => setAdults((a) => Math.max(1, a - 1))}>
                    −
                  </Button>
                  <span className="w-6 text-center">{adults}</span>
                  <Button variant="outline" className="w-8 h-8 p-0 border" onClick={() => setAdults((a) => a + 1)}>
                    +
                  </Button>
                </div>
              </div>

              {/* Done button */}
              <div className="mt-4 flex justify-end border-t">
                <Button className="bg-blue-600 text-white px-6 mt-2">Done</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button className="flex items-center justify-center gap-2  px-5 py-2 text-sm font-semibold bg-[#2563EB]  hover:brightness-95">Search</Button>
      </div>
    </div>
  );
};
