'use client';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HotelCard } from '@/components/HotelCard';
import { SearchCard } from '@/components/SearchCard';
import { useGetHotelQuery } from '@/generated';

const Page = () => {
  const { data } = useGetHotelQuery();

  return (
    <div className="min-h-screen w-full bg-[#F6F7FB]">
      <Header />
      <SearchCard />

      <HotelCard hotels={data?.getHotel} />

      <Footer />
    </div>
  );
};

export default Page;
