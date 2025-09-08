import { HotelType } from '@/app/admin/hotels/[hotelId]/_Components/HotelDetail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

type HotelRoomsType = {
  data: HotelType | undefined;
};

export const HotelRooms = ({ data }: HotelRoomsType) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.rooms?.map((room) => {
        return (
          <Card className="">
            <CardHeader>
              <Image src={room?.roomImgs?.[0] || ''} alt={room?.roomNumber || ''} width={350} height={210} className="" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>{room?.roomType}</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-2">
                  <p>Bathroom:</p>
                  {room?.amenities?.bathroom.map((el) => {
                    return <Badge>{el}</Badge>;
                  })}
                </div>
                <div className="flex gap-2">
                  <p>Accessibility:</p>
                  {room?.amenities?.accessibility.map((el) => {
                    return <Badge>{el}</Badge>;
                  })}
                </div>
                <div className="flex gap-2">
                  <p>Bedroom:</p>
                  {room?.amenities?.bedroom.map((el) => {
                    return <Badge>{el}</Badge>;
                  })}
                </div>

                <div className="flex gap-2">
                  <p>Entertainment:</p>
                  {room?.amenities?.technology.map((el) => {
                    return <Badge>{el}</Badge>;
                  })}
                </div>
              </div>

              <div className="border"></div>
              <div>{room?.pricePerNight} ₮</div>
              <Button variant="hotel">Reserve</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
