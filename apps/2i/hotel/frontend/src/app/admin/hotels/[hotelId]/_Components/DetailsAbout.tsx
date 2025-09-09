import { Card, CardContent } from '@/components/ui/card';
import { HotelType } from './HotelDetail';

type AboutType = {
  hotel: HotelType | undefined;
};

export const AboutProperty = ({ hotel }: AboutType) => {
  return (
    <Card className="p-6 space-y-8">
      <div className="flex justify-between border-b">
        <div className="mb-4 ">
          <h1 className="text-lg font-semibold text-gray-800">About This Property</h1>
        </div>
      </div>

      <CardContent className="mt-4 space-y-2">
        <h1 className="text-lg font-semibold ">{hotel?.hotelName}</h1>
        {hotel?.about}
        <h1 className="font-bold text-[18px]">Languages</h1>
        {hotel?.languages.map((lan, index) => {
          return <p key={index}>{lan}</p>;
        })}
      </CardContent>
    </Card>
  );
};
