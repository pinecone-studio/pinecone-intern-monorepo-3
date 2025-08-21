'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RoomServicesModal = () => {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Room Services</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Room Services</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathroom</label>
              <Input placeholder="Enter bathroom details" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Accessibility</label>
              <Input placeholder="Enter accessibility details" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entertainment</label>
              <Input placeholder="Enter entertainment details" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Food and drink</label>
              <Input placeholder="Enter food & drink details" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stars Rating</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Other</label>
              <Textarea placeholder="Enter other details" />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
