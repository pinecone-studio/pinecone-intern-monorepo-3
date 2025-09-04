import { Button } from '@/components/ui/button';
import { AddRoomGeneral } from './AddRoomGeneral';
import { ChevronLeft } from 'lucide-react';
import { AddRoomServices } from './AddRoomServices';
import { AddRoomImages } from './AddRoomImages';

export const AddRoom = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <Button size="icon" variant="secondary">
          <ChevronLeft />
        </Button>
        <p className="text-[18px] font-semibold">Add new Room</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AddRoomGeneral />
        <AddRoomImages />
        <AddRoomServices />
      </div>
    </div>
  );
};
