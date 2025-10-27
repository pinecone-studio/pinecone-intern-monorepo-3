'use client';

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
    <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
      {/* Гарчиг */}
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">Захиалга</h1>

      {/* Огноо болон статус filter */}
      <div className="flex gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="px-3 py-1 text-gray-700 bg-white border-gray-300 shadow-none hover:bg-gray-50">
              {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Өнөөдөр'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white border border-gray-200 rounded-md shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || undefined);
                if (date && onDateChange) onDateChange(date);
              }}
              className="text-gray-800 bg-white rounded-md"
            />
          </PopoverContent>
        </Popover>

        <SelectStatus value={status} onValueChange={onStatusChange} isAll={true} />
      </div>
    </div>
  );
};
