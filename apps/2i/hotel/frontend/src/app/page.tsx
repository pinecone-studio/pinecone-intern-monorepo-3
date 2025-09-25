'use client';

import { Checkout } from '@/components/Checkout';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HotelCard } from '@/components/HotelCard';
import { SearchCard } from '@/components/SearchCard';
import { useGetHotelQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Page = () => {
  const { data } = useGetHotelQuery();

  const hotels = [
    {
      name: 'Toyoko Inn Ulaanbaatar',

      image: '/hotel3',

      ratingScore: 9.0,
      ratingLabel: 'Excellent',
      wifi: 'free',
      spa: 'access',
      parking: 'free self parking',
    },

    {
      name: 'Flower Hotel',
      image: '/hotel3',

      ratingScore: 8.5,
      ratingLabel: 'Very Good',
      wifi: 'paid',
      spa: 'access',
      parking: 'free self parking',
    },
    {
      name: 'Edelweiss Art Hotel',
      image: '/hotel3',

      ratingScore: 9.1,
      ratingLabel: 'Excellent',
      wifi: 'free',
      spa: 'access',
      parking: 'free self parking',
    },
    {
      name: 'Hotel Nine',
      image: '/hotel3',

      ratingScore: 8.2,
      ratingLabel: 'Very Good',
      wifi: 'paid',
      spa: 'access',
      parking: 'free self parking',
    },
  ];

  const most = [
    {
      name: 'Toyoko Inn Ulaanbaatar',

      image: '/hotel3',
      ratingScore: 9.0,
      ratingLabel: 'Excellent',
      wifi: 'paid',
      spa: 'access',
      parking: 'free self parking',
    },
    {
      name: 'Edelweiss Art Hotel',
      image: '/hotel3',

      ratingScore: 9.1,
      ratingLabel: 'Excellent',
      wifi: 'paid',
      spa: 'access',
      parking: 'free self parking',
    },
    {
      name: 'Flower Hotel',
      image: '/hotel3',
      price: '$66/night',
      ratingScore: 8.5,
      ratingLabel: 'Very Good',
      wifi: 'paid',
      spa: 'access',
      parking: 'free self parking',
    },
    { name: 'Hotel Nine', image: '/hotel4.jpg', price: '$61/night', ratingScore: 8.2, ratingLabel: 'Very Good', wifi: 'paid', spa: 'access', parking: 'free self parking' },
    { name: 'Toyoko Inn Ulaanbaatar', image: '/hotel1.jpg', price: '$58/night', ratingScore: 9.0, ratingLabel: 'Excellent', wifi: 'paid', spa: 'access', parking: 'free self parking' },
    { name: 'Edelweiss Art Hotel', image: '/hotel2.jpg', price: '$72/night', ratingScore: 9.1, ratingLabel: 'Excellent', wifi: 'paid', spa: 'access', parking: 'free self parking' },
    { name: 'Flower Hotel', image: '/hotel3.jpg', price: '$66/night', ratingScore: 8.5, ratingLabel: 'Very Good', wifi: 'paid', spa: 'access', parking: 'free self parking' },
    { name: 'Hotel Nine', image: '/hotel4.jpg', price: '$61/night', ratingScore: 8.2, ratingLabel: 'Very Good', wifi: 'paid', spa: 'access', parking: 'free self parking' },
  ];
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return <Checkout />;
  }
  return (
    <div className="min-h-screen w-full bg-[#F6F7FB]">
      <Header />
      <SearchCard />
      <HotelCard hotels={data?.getHotel} />
      <Footer />
      <Button onClick={() => setShowCheckout(true)}>checkout</Button>
      <SearchCard />

      <HotelCard hotels={hotels} />

      <MostBooked most={most} />
      <Footer />
    </div>
  );
};

export default Page;
