import { DetailLocation } from './DetailLocation';
import { DetailImage } from './DetailsImage';
import { HotelType } from './HotelDetail';

type RightType = {
  hotel: HotelType;
};

export const RightColumn = ({ hotel }: RightType) => {
  if (!hotel) return null;
  return (
    <div className="flex flex-col gap-4">
      <DetailLocation />
      {hotel && <DetailImage hotelData={hotel} />}
    </div>
  );
};
