import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Star } from 'lucide-react';
export const Generalinfo = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between border-b">
        <h1 className="text-lg font-bold">General Info</h1>

        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[626px] ">
            <DialogHeader>
              <DialogTitle>General Info</DialogTitle>
            </DialogHeader>
            <Label>Name</Label>
            <Input placeholder="Hotel Name" className="" />
            <Label>Description</Label>
            <Textarea placeholder="Hotel Description" className="" />
            <Label>Starts Rating </Label>
            <Input placeholder="Hotel Starting rating " className="" />
            <Label>Phone number</Label>
            <Input placeholder=" Phone number" className="" />
            <Label>Rating</Label>
            <Input placeholder=" Rating" className="" />
            <div className="flex justify-between">
              <Button>Cancel</Button>
              <Button className="bg-[#2563EB] text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex  p-6 ">
        <div className="flex-col justify-between gap-6">
          <div className="flex flex-col ">
            <label className="text-sm text-gray-500">Name</label>
            <p className="text-sm">Chingis khan hotel</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="text-sm">72700880</p>
          </div>
          <div>
            <label className="text-base text-gray-500">Description</label>
            <p className="text-sm text-gray-700">Ulaanbaatar hotel in Downtown Ulaanbaatar with 4 restaurants and a full-service spa</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500">Rating</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium border rounded-xl">8.8</span>
            <span className="text-sm text-gray-500">Excellent</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Stars Rating</label>
          <div className="flex gap-1 text-[#F97316]">⭐⭐⭐⭐⭐</div>
        </div>
      </div>
    </Card>
  );
};
