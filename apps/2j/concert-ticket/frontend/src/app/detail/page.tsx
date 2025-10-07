'use client';

import { NavBar } from '@/components/detail/nav';
import { Footer } from '@/components/detail/footer';

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NavBar onSearch={handleSearch} onCartClick={handleCartClick} onRegisterClick={handleRegisterClick} onLoginClick={handleLoginClick} />
      <main className="container p-8 mx-auto flex-1">
        <h1 className="text-3xl text-white">Concert Ticket Booking</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
