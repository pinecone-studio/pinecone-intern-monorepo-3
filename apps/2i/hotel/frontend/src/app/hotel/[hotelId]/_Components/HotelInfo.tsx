import { HotelType } from '@/app/admin/hotels/[hotelId]/_Components/HotelDetail';
import { Badge } from '@/components/ui/badge';
import { Phone, Star } from 'lucide-react';

type HotelInfoType = {
  data: HotelType | undefined;
};

export const HotelInfo = ({ data }: HotelInfoType) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-[30px] font-semibold">{data?.hotelName}</h1>
        <div className="flex gap-2 items-center">
          <p>{data?.starRating}</p>
          <Star className="w-[16px] h-[16px] fill-yellow-300 text-yellow-300" />
        </div>
        <p>{data?.description}</p>
        <div className="border"></div>
        <div className="flex gap-2">
          {data?.amenities?.map((el, index) => {
            return (
              <Badge key={index} variant="outline">
                {el}
              </Badge>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-[16px] font-bold">Location</h1>
          <div className="border p-4">{data?.location}</div>
        </div>
        <div>
          <h1 className="text-[16px] font-bold">Contact</h1>
          <div className="flex gap-2 items-center">
            <Phone />
            <div>
              <p>Phone number</p>
              <p>{data?.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
