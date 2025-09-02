'use client';

import { useParams } from 'next/navigation';
import { HotelDetail } from '../../_Components/HotelDetail';

const HotelHomePage = () => {
  const { hotelId } = useParams() as { hotelId: string };

  return (
    <div>
      <HotelDetail hotelId={hotelId} />
    </div>
  );
};
export default HotelHomePage;
