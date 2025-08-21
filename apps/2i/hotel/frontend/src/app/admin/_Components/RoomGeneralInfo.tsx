'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RoomGeneralInfoDialog = ({ data, setData }: any) => {
  const [open, setOpen] = useState(false);

  type FormFields = { name: string; type: string; price: string; room: string };
  const handleChange = (field: keyof FormFields, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit General Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>General Info</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start">
            <label className="text-right">Name</label>
            <Input className="col-span-3" value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>

          <div className="flex flex-col items-start">
            <label className="text-right">Type</label>
            <Select value={data.type} onValueChange={(v) => handleChange('type', v)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col items-start">
            <label className="text-right">Price per night</label>
            <Input className="col-span-3" value={data.price} onChange={(e) => handleChange('price', e.target.value)} />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="text-right pt-2">Room information</label>
            <Textarea className="col-span-3" value={data.room} onChange={(e) => handleChange('room', e.target.value)} rows={4} />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
