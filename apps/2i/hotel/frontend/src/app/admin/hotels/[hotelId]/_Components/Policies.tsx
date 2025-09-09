import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HotelType } from './HotelDetail';

type PoliciesType = {
  hotel: HotelType | undefined;
};

export const Policies = ({ hotel }: PoliciesType) => {
  return (
    <Card className="p-4">
      <CardHeader className="font-bold text-[18px] border-b">Policies</CardHeader>
      <CardContent className="p-6">
        <div>
          {hotel?.policies?.map((el, index) => {
            return (
              <div key={index} className="flex justify-between">
                <h1>{el?.title}</h1>
                <p>{el?.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
