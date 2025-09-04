import { Amenities } from './Amenities';
import { AboutProperty } from './DetailsAbout';
import { DetailsQuestions } from './DetailsQuestions';
import { HotelType } from '../../../_Components/HotelsPage';
import { Policies } from './Policies';
import { RoomTypes } from './RoomTypes';
import { UpcomingBookings } from './UpcomingBookings';
import { Generalinfo } from './Generalinfo';

export const LeftColumn = ({ hotel }: { hotel?: HotelType | null | undefined }) => (
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
