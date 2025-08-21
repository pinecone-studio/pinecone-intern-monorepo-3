'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const LocationDialog = () => {
  const handleSave = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Amenities</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline">Airport transfer</Button>
          <Button variant="outline">Gym</Button>
          <Button variant="outline">Spa</Button>
          <Button variant="outline">Non-smoking</Button>
          <Button variant="outline">Free Wi-Fi</Button>
          <Button variant="outline">Free parking</Button>
          <Button variant="outline">24/7 front desk</Button>
          <Button variant="outline">Bar</Button>
          <Button variant="outline">Air conditioning</Button>
          <Button variant="outline">Laundry facilities</Button>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
