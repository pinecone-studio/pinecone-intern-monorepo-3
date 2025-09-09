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
          <Card key={room?._id}>
            <CardHeader>
              <Image src={room?.roomImgs?.[0] ?? '/placeholder.png'} alt={room?.roomNumber ?? 'room'} width={350} height={210} className="" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>{room?.roomType}</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Bathroom', items: room?.amenities?.bathroom },
                  { label: 'Accessibility', items: room?.amenities?.accessibility },
                  { label: 'Bedroom', items: room?.amenities?.bedroom },
                  { label: 'Entertainment', items: room?.amenities?.technology },
                ].map(({ label, items }) => (
                  <div key={label} className="flex gap-2 flex-wrap">
                    <p>{label}:</p>
                    {items?.length ? items.map((el, i) => <Badge key={i}>{el}</Badge>) : <span className="text-gray-500">No {label.toLowerCase()}</span>}
                  </div>
                ))}
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
