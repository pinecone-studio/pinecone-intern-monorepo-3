'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const GeneralInfoDialog = ({ data, setData }: any) => {
  const [open, setOpen] = useState(false);
  const handleChange = (field: keyof typeof data, value: string) => setData({ ...data, [field]: value });

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input className="col-span-3" value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Description</Label>
            <Textarea className="col-span-3" value={data.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Stars</Label>
            <Select value={data.stars} onValueChange={(v) => handleChange('stars', v)}>
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Phone</Label>
            <Input className="col-span-3" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rating</Label>
            <Select value={data.rating} onValueChange={(v) => handleChange('rating', v)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
