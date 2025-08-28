import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Star } from 'lucide-react';

export const AddHotelGeneral = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between border-b">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800">General Info</h1>
        </div>
        {/* dialog */}
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
            <select className="border rounded-lg h-[40px] px-1" name="select rating">
              <option value="5 stars">5 stars</option>
              <option value="4 stars">4 stars</option>
              <option value="3 stars">3 stars</option>
              <option value="2 stars">2 stars</option>
              <option value="1 star">1 star</option>
            </select>
            <Label>Phone number</Label>
            <Input placeholder=" Phone number" className="" />
            <select>
              <option value="someOption">Some option</option>
              <option value="otherOption">Other option</option>
            </select>
            <div className="flex justify-between">
              <Button>Cancel</Button>
              <Button className="bg-[#2563EB] text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-2 justify-between p-6 ">
        <div>
          <label className="text-sxm text-gray-500">Name</label>
          <p className="text-sm">-/-</p>
        </div>

        <div className="flex justify-between items-center ">
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="text-sm flex gap-2 items-center">
              <Phone className="w-4 h-4" />
              -/-
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Rating</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium border rounded-xl w-[39px] h-[20px] text-white flex justify-center bg-[#2563EB]">0.0</span>
              <span className="font-medium text-sm  text-[#09090B] ">None</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Stars Rating</label>
            <div className="flex gap-1 ">
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-base text-gray-500">Description</label>
          <p className="text-sm text-[#09090B] font-medium">-/-</p>
        </div>
      </div>
    </Card>
  );
};
