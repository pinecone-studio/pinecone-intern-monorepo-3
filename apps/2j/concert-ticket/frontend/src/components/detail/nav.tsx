'use client';

import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';

interface NavBarProps {
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onRegisterClick?: () => void;
  onLoginClick?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onSearch, onCartClick, onRegisterClick, onLoginClick }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <nav className="px-6 py-4 text-white bg-black">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 gap-2" data-testid="logo">
          <div className="w-3 h-3 rounded-full bg-cyan-400" data-testid="logo-dot" />
          <span className="text-lg font-light tracking-wide whitespace-nowrap">TICKET BOOKING</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[420px] mx-4" data-testid="search-form">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Хайлт"
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-lg py-2.5 pl-4 pr-12 border border-gray-800 focus:outline-none focus:border-gray-700 transition-colors"
              data-testid="search-input"
            />
            <button type="submit" className="absolute text-gray-400 transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-white" data-testid="search-button">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center flex-shrink-0 gap-4">
          {/* Cart Icon */}
          <button onClick={onCartClick} className="p-2 transition-colors rounded-lg hover:bg-gray-900" aria-label="Shopping cart" data-testid="cart-button">
            <ShoppingCart className="w-6 h-6" />
          </button>

          {/* Register Button */}
          <button onClick={onRegisterClick} className="px-6 py-2 text-white transition-colors rounded-lg hover:bg-gray-900 whitespace-nowrap" data-testid="register-button">
            Бүртгүүлэх
          </button>

          {/* Login Button */}
          <button onClick={onLoginClick} className="px-6 py-2 font-medium text-black transition-colors rounded-lg bg-cyan-400 hover:bg-cyan-500 whitespace-nowrap" data-testid="login-button">
            Нэвтрэх
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
