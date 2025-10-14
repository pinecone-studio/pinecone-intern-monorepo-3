'use client';

import { NavBar } from '@/components/detail/nav';
import { Footer } from '@/components/detail/footer';
import { HeroSlider } from '@/components/detail/hero-slider';
import { ConcertDetails } from '@/components/detail/concert-details';

const Page = () => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleRegisterClick = () => {
    console.log('Register clicked');
  };

  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  const handleBookTicket = () => {
    console.log('Book ticket clicked');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <NavBar onSearch={handleSearch} onCartClick={handleCartClick} onRegisterClick={handleRegisterClick} onLoginClick={handleLoginClick} />

      {/* Hero Slider */}
      <HeroSlider title="MUSIC of the SPHERES" artist="coldplay" dates={['10.31', '11.01', '11.02']} backgroundImage="/images/hero-bg.jpg" />

      {/* Concert Details Section */}
      <ConcertDetails
        eventDate="2024.11.15 - 11.18"
        eventTime="19:00"
        venue="UG ARENA"
        specialArtists={['ХАР ТАС', 'Mr.DoggS']}
        schedule={{
          doorOpen: '6pm',
          musicStart: '22pm',
        }}
        ticketCategories={[
          {
            id: '1',
            name: 'Арын тасалбар',
            price: 89000,
            available: 123,
            color: '#D7D7F8',
          },
          {
            id: '2',
            name: 'VIP тасалбар',
            price: 129000,
            available: 38,
            color: '#4651c9',
          },
          {
            id: '3',
            name: 'Энгийн тасалбар',
            price: 159000,
            available: 38,
            color: '#c772c4',
          },
        ]}
        onBookTicket={handleBookTicket}
      />

      <Footer />
    </div>
  );
};

export default Page;
