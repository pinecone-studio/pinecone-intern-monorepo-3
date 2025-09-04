import { DetailLocation } from './DetailLocation';

import { HotelType } from '../../../_Components/HotelsPage';
import { DetailImage } from './DetailsImage';

export const RightColumn = ({ hotel }: { hotel: HotelType | null }) => (
  <div className="flex flex-col gap-4">
    <DetailLocation />
    {hotel && <DetailImage hotelData={hotel} />}
  </div>
);
