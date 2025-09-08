import { Amenities } from './Amenities';
import { AboutProperty } from './DetailsAbout';
import { DetailsQuestions } from './DetailsQuestions';
import { Policies } from './Policies';
import { RoomTypes } from './RoomTypes';
import { UpcomingBookings } from './UpcomingBookings';
import { Generalinfo } from './Generalinfo';
import { HotelType } from './HotelDetail';

type LeftType = {
  hotel?: HotelType;
};

export const LeftColumn = ({ hotel }: LeftType) => {
  if (!hotel) return null;
  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <UpcomingBookings />
      <RoomTypes />
      <Generalinfo data={hotel} />
      <Amenities />
      <AboutProperty />
      <Policies />
      <DetailsQuestions />
    </div>
  );
};
