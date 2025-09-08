'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '../../../../../../../../libs/shadcn/src/lib/utils';
import { useState } from 'react';
import { useGetHotelQuery } from '@/generated';

export const RoomComboBox = () => {
  const { data } = useGetHotelQuery();

  const rooms = data?.getHotel.flatMap((hotel) => hotel?.rooms?.filter((room) => room !== null) || []) ?? [];

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value || 'Rooms'}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rooms" className="h-9" />
          <CommandList>
            <CommandEmpty>No Room found.</CommandEmpty>
            <CommandGroup>
              {rooms?.map((room) => (
                <CommandItem
                  key={room?._id}
                  value={room?.roomNumber!}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {room?.roomType}-{room?.roomNumber}
                  {/* <Check className={cn('ml-auto', value === loc ? 'opacity-100' : 'opacity-0')} /> */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
