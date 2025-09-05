'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '../../../../../../../../libs/shadcn/src/lib/utils';
import { useState } from 'react';
import { useGetHotelQuery } from '@/generated';

export const RatingComboBox = () => {
  const { data } = useGetHotelQuery();

  const ratings = data?.getHotel.flatMap((hotel) => hotel?.userRating?.filter((r) => r !== null) ?? []) ?? [];

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value || 'User Ratings'}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="User Rating" className="h-9" />
          <CommandList>
            <CommandEmpty>No User Rating found.</CommandEmpty>
            <CommandGroup>
              {ratings?.map((rate, index) => (
                <CommandItem
                  key={index}
                  value={rate?.rating?.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {rate.rating}
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
