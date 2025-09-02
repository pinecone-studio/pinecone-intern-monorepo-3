import { DetailLocation } from './DetailLocation';
import { DetailImage } from './DetailsImage';
import { HotelType } from './HotelsPage';

export const RightColumn = ({ hotel }: { hotel: HotelType | null }) => (
  <div className="flex flex-col gap-4">
    <DetailLocation />
    {hotel && <DetailImage hotelData={hotel} />}
  </div>
);
