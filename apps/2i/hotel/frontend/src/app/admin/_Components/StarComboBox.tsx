'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '../../../../../../../../libs/shadcn/src/lib/utils';
import { useState } from 'react';
import { useGetHotelQuery } from '@/generated';

export const StarComboBox = () => {
  const { data } = useGetHotelQuery();

  const stars = data?.getHotel.map((hotel) => hotel?.starRating);

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? stars?.find((el) => el === value) : 'Star Rating'}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Stars" className="h-9" />
          <CommandList>
            <CommandEmpty>No Star rating found.</CommandEmpty>
            <CommandGroup>
              {stars?.map((star, index) => (
                <CommandItem
                  key={index}
                  value={star}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {star}
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
