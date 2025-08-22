'use client';

import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const LocationDialog = () => {
  const [location, setLocation] = useState('Damdínbazar street-52, Bayangol district, Bayangol, 212513 Ulaanbaatar, Mongolia');

  const handleSave = () => {
    console.log('Saved location:', location);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => console.log('Cancelled')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
