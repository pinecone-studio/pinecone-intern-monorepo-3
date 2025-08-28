import { DetailLocation } from './DetailLocation';
import { DetailImage } from './DetailsImage';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { HotelsPage } from './HotelsPage';
import { AddHotelUpcoming } from './_addhotel/AddUpcoming';
import { AddHotelRoom } from './_addhotel/AddRoom';
import { AddHotelGeneral } from './_addhotel/AddGeneral';
import { AddHotelAmenities } from './_addhotel/AddAminities';
import { AddAbout } from './_addhotel/AddAbout';
import { AddPolicies } from './_addhotel/AddPolicies';
import { AddQuestions } from './_addhotel/AddQuestions';
import { AddLocation } from './_addhotel/AddLocation';
import { AddImage } from './_addhotel/AddImages';
type AddHotelProps = {
  onBack: () => void;
};
export const AddHotel = ({ onBack }: AddHotelProps) => {
  const [backButton, setBackButton] = useState<string | null>(null);
  if (backButton) {
    return <HotelsPage />;
  }
  return (
    <div className=" space-y-6 p-6">
      <div className="flex gap-3 items-center">
        {' '}
        <Button
          variant={'outline'}
          onClick={() => {
            onBack();
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="font-bold text-[16px]"> Hotel name</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AddHotelUpcoming />
          <AddHotelRoom />
          <AddHotelGeneral />
          <AddHotelAmenities />
          <AddAbout />
          <AddPolicies />
          <AddQuestions />
        </div>

        {/* right */}
        <div className="flex flex-col gap-4">
          <AddLocation />
          <AddImage />
        </div>
      </div>
    </div>
  );
};
