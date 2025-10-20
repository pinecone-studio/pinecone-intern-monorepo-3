'use client';

import Navbar from '@/components/home/Navbar';
import HeroCarousel from '@/components/home/HeroCarousel';
import EventGrid from '@/components/home/EventGrid';
import Footer from '@/components/home/Footer';

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-[16px]">
        <HeroCarousel className="mt-[16px]" />
        <EventGrid className="mt-[16px] mb-[32px]" />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
