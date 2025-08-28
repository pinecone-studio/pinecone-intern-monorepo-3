import { Header } from './_components/header';
import { SearchCard } from './_components/SearchCard';
import { HotelCard } from './_components/HotelCard';
import { MostBooked } from './_components/Mostbooked';
import { Footer } from './_components/footer';

const hotels = [
  {
    name: 'Toyoko Inn Ulaanbaatar',

    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D',

    ratingScore: 9.0,
    ratingLabel: 'Excellent',
    wifi: 'free',
    spa: 'access',
    parking: 'free self parking',
  },

  {
    name: 'Flower Hotel',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',

    ratingScore: 8.5,
    ratingLabel: 'Very Good',
    wifi: 'paid',
    spa: 'access',
    parking: 'free self parking',
  },
  {
    name: 'Edelweiss Art Hotel',
    image: 'https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsfGVufDB8fDB8fHww',

    ratingScore: 9.1,
    ratingLabel: 'Excellent',
    wifi: 'free',
    spa: 'access',
    parking: 'free self parking',
  },
  {
    name: 'Hotel Nine',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',

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

    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    ratingScore: 9.0,
    ratingLabel: 'Excellent',
    wifi: 'paid',
    spa: 'access',
    parking: 'free self parking',
  },
  {
    name: 'Edelweiss Art Hotel',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww',

    ratingScore: 9.1,
    ratingLabel: 'Excellent',
    wifi: 'paid',
    spa: 'access',
    parking: 'free self parking',
  },
  {
    name: 'Flower Hotel',
    image: 'https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D',
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
const UserPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#F6F7FB]">
      <Header />
      <SearchCard />

      <HotelCard hotels={hotels} />

      <MostBooked most={most} />
      <Footer />
    </div>
  );
};

export default UserPage;
