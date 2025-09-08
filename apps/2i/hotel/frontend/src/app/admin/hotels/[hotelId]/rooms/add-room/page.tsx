'use client';

import { useGetHotelByIdQuery } from '@/generated';
import { AddRoom } from './_Components/_AddRoom/AddRoom';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const Rooms = () => {
  const { hotelId } = useParams() as { hotelId: string };
  const [roomId, setRoomId] = useState<string | undefined>();
  const { data } = useGetHotelByIdQuery({
    variables: {
      getHotelByIdId: hotelId as string,
    },
  });
  console.log(data, 'data id');
  return (
    <div>
      <AddRoom hotelId={hotelId} roomId={roomId} setRoomId={setRoomId} />
    </div>
  );
};

export default Rooms;
