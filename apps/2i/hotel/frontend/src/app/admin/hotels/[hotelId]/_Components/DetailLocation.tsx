import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { HotelType } from './HotelDetail';

type LocationType = {
  hotel: HotelType | undefined;
};

export const DetailLocation = ({ hotel }: LocationType) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between p-6">
        <CardTitle className="text-lg font-semibold text-gray-900">Location</CardTitle>
        <Dialog>
          <DialogTrigger className="text-[#2563EB]">Edit</DialogTrigger>
          <DialogContent className="w-[480px] ">
            <DialogHeader>
              <DialogTitle>Location</DialogTitle>
            </DialogHeader>
            <Textarea placeholder="Enter location details" className="" />
            <div className=" flex justify-between">
              <Button>Cancel</Button>
              <Button className="text-white bg-[#2563EB]">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="flex flex-col gap-3">{hotel?.location ? <h1 className="text-base">{hotel?.location}</h1> : <span className="text-gray-400 italic">No location info</span>}</CardContent>
    </Card>
  );
};
