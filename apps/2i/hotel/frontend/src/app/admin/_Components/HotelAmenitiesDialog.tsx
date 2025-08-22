'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HotelAmenitiesDialog = () => {
  const handleSave = () => {
    console.log('Amenities saved');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Amenities</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 py-4 flex-wrap">
          <Badge variant="outline">Airport transfer</Badge>
          <Badge variant="outline">Gym</Badge>
          <Badge variant="outline">Spa</Badge>
          <Badge variant="outline">Non-smoking</Badge>
          <Badge variant="outline">Free Wi-Fi</Badge>
          <Badge variant="outline">Free parking</Badge>
          <Badge variant="outline">24/7 front desk</Badge>
          <Badge variant="outline">Bar</Badge>
          <Badge variant="outline">Air conditioning</Badge>
          <Badge variant="outline">Laundry facilities</Badge>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
