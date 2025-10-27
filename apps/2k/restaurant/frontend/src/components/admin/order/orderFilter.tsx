'use client';

import { useState } from 'react';
import { SelectStatus } from './SelectStatus';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface OrderFilterProps {
  status: string;
  onStatusChange: (_val: string) => void;
  onDateChange?: (_date: Date) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (_date: Date | undefined) => void;
}

export const OrderFilter = ({ status, onStatusChange, onDateChange, selectedDate, setSelectedDate }: OrderFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      {/* Гарчиг */}
      <h1 className="text-xl sm:text-2xl font-medium text-gray-900">Захиалга</h1>

      {/* Огноо болон статус filter */}
      <div className="flex gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="px-3 py-1 text-gray-700 border-gray-300 bg-white hover:bg-gray-50 shadow-none">
              {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Өнөөдөр'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-sm rounded-md">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || undefined);
                if (date && onDateChange) onDateChange(date);
              }}
              className="bg-white text-gray-800 rounded-md"
            />
          </PopoverContent>
        </Popover>

        <SelectStatus value={status} onValueChange={onStatusChange} isAll={true} />
      </div>
    </div>
  );
};
