import { useGetHotelByIdQuery } from '@/generated';
import { HotelImages } from './HotelImages';
import { HotelInfo } from './HotelInfo';
import { HotelRooms } from './HotelRooms';

type HotelDetailsType = {
  hotelId: string;
};

export const HotelDetails = ({ hotelId }: HotelDetailsType) => {
  const { data } = useGetHotelByIdQuery({
    variables: {
      getHotelByIdId: hotelId,
    },
  });

  return (
    <div className="flex flex-col justify-center items-center pt-[50px] px-[100px] gap-8">
      <HotelImages data={data?.getHotelById} />
      <HotelInfo data={data?.getHotelById} />
      <HotelRooms data={data?.getHotelById} />
    </div>
  );
};
