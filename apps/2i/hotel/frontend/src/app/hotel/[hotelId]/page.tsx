'use client';

import { useParams } from 'next/navigation';
import { HotelDetails } from './_Components/HotelDetails';
import { Header } from '@/components/Header';
import { SearchCard } from '@/components/SearchCard';

const UserHotelPage = () => {
  const { hotelId } = useParams() as { hotelId: string };
  return (
    <div>
      <Header />
      <SearchCard />
      <HotelDetails hotelId={hotelId} />
    </div>
  );
};

export default UserHotelPage;
