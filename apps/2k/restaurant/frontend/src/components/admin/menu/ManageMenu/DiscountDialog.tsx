import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar'; // ShadCN Calendar

import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { format } from 'date-fns';

export const AddDialog = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all rounded-lg">
            Хямдрал <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Хямдрал нэмэх</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Хямдралын нэр</Label>
              <Input id="name-1" name="name" placeholder="Хямдралын нэр" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="discount">Хямдралын хувь</Label>
              <Input id="discount" name="discount" placeholder="Хямдралын хувь" />
            </div>

            {/* Start Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'yyyy-MM-dd')} - ${format(dateRange.to, 'yyyy-MM-dd')}` : 'Огноо сонгох'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
