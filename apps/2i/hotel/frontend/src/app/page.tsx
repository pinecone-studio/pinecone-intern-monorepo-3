'use client';

import { Footer } from '@/components/Footer';

import { HotelCard } from '@/components/HotelCard';
import { MostBooked } from '@/components/Mostbooked';
import { SearchCard } from '@/components/SearchCard';

const Page = () => {
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
  return (
    <div className="min-h-screen w-full bg-[#F6F7FB]">
      <SearchCard />

      <HotelCard hotels={hotels} />

      <MostBooked most={most} />
      <Footer />
    </div>
  );
};

export default Page;
