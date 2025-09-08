'use client';

import { Button } from '@/components/ui/button';
import { AddRoomGeneral } from './AddRoomGeneral';
import { ChevronLeft } from 'lucide-react';
import { AddRoomServices } from './AddRoomServices';
import { AddRoomImages } from './AddRoomImages';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

type AddRoomType = {
  hotelId: string | undefined;
  roomId: string | undefined;
  setRoomId: Dispatch<SetStateAction<string | undefined>>;
};

export const AddRoom = ({ hotelId, roomId, setRoomId }: AddRoomType) => {
  const router = useRouter();
  const handleBackHotel = () => {
    router.push(`/admin/hotels/${hotelId}`);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <Button size="icon" variant="secondary" type="button" onClick={handleBackHotel}>
          <ChevronLeft />
        </Button>
        <p className="text-[18px] font-semibold">Add new Room</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AddRoomGeneral setRoomId={setRoomId} hotelId={hotelId} />
        <AddRoomImages roomId={roomId} />
        <AddRoomServices roomId={roomId} />
      </div>
    </div>
  );
};
