'use client';

import { useParams } from 'next/navigation';
import { HotelDetail } from '../../_Components/HotelDetail';

const Hotels = () => {
  const { id } = useParams<{ id: string }>();
  return <HotelDetail hotelId={id} />;
};

export default Hotels;
