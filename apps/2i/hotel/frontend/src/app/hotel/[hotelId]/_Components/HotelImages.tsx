import { HotelType } from '@/app/admin/hotels/[hotelId]/_Components/HotelDetail';
import Image from 'next/image';

type HotelImagesType = {
  data: HotelType | undefined;
};

export const HotelImages = ({ data }: HotelImagesType) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {data?.image.map((img, index) => {
        return (
          <div key={index} className="w-[300px] h-[150px]">
            <Image src={img || ''} alt={img || ''} width={300} height={150} className="object-cover w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};
