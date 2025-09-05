'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '../../../../../../../../libs/shadcn/src/lib/utils';
import { useState } from 'react';
import { useGetHotelQuery } from '@/generated';

export const LocationComboBox = () => {
  const { data } = useGetHotelQuery();
  console.log(data, 'combo');

  const locations = data?.getHotel.map((hotel) => hotel?.location);

  // const filteredLocations = locations?.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()));

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? locations?.find((el) => el === value) : 'Location'}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Location" className="h-9" />

          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations?.map((loc, index) => (
                <CommandItem
                  key={index}
                  value={loc}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {loc}
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
