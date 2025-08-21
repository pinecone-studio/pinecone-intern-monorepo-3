'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RoomServicesModal = ({ services, setServices }: any) => {
  const [open, setOpen] = useState(false);

  const handleChange = (field: keyof typeof services, value: string) => {
    setServices((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Room Services</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Room Services</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {(['bathroom', 'accessibility', 'entertainment', 'foodAndDrink', 'other'] as const).map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === 'other' ? (
                <Textarea placeholder={`Enter ${field} details`} value={services[field]} onChange={(e) => handleChange(field, e.target.value)} />
              ) : (
                <Input placeholder={`Enter ${field} details`} value={services[field]} onChange={(e) => handleChange(field, e.target.value)} />
              )}
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium">Stars Rating</label>
            <Select value={services.starsRating} onValueChange={(v) => handleChange('starsRating', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s} Star{s > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
