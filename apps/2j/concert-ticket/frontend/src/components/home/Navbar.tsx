'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMyProfileQuery } from '@/generated';

interface Props {
  className?: string;
}

const Navbar: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  // User profile data
  const { data: profileData } = useMyProfileQuery({
    errorPolicy: 'all',
  });

  // Authentication state based on profile data
  const isLoggedIn = !!profileData?.myProfile;

  const goSearch = (q?: string) => {
    const keyword = (q ?? query).trim();
    const url = keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search';
    if (pathname !== '/search') {
      router.push(url);
    } else {
      router.replace(url);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      goSearch();
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      // Нэвтэрсэн хэрэглэгч - orders page руу үсэрэх
      router.push('/orders');
    } else {
      // Нэвтэрээгүй хэрэглэгч - toast харуулах
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <header className={`w-full bg-[#0e0e0e] ${className ?? ''}`}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[12px] py-[8px] sm:px-[16px] sm:py-[12px]">
        {/* Logo */}
        <div className="flex items-center gap-[8px]">
          <div data-testid="logo-dot" className="h-[8px] w-[8px] rounded-full bg-cyan-400" />
          <Link href="/" className="text-[14px] font-semibold tracking-wide hover:text-cyan-400 transition-colors" data-testid="logo">
            TICKET BOOKING
          </Link>
        </div>

        {/* Search box */}
        <div className="flex items-center gap-[12px]">
          <div className="relative h-[32px] w-[180px] overflow-hidden rounded-[8px] bg-[#1a1a1a] sm:h-[36px] sm:w-[240px] md:w-[360px]">
            <input
              data-testid="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => pathname !== '/search' && router.push('/search')}
              className="h-full w-full bg-transparent px-[8px] pr-[28px] text-[12px] outline-none sm:px-[12px] sm:pr-[34px]"
              placeholder="Хайх..."
            />
            <span className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#b3b3b3]">
              <Search size={16} />
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-[12px]">
          {/* Cart button */}
          <button 
            aria-label="Сагс" 
            onClick={handleCartClick}
            className="flex h-[32px] w-[36px] items-center justify-center rounded-[8px] bg-[#1a1a1a] text-[12px] sm:w-[40px] hover:bg-[#2a2a2a] transition-colors"
          >
            <ShoppingCart size={16} />
          </button>

          {/* Authentication-based rendering */}
          {isLoggedIn ? (
            // Logged in state - show email
            <button onClick={() => router.push('/profile')} className="flex items-center gap-[8px] rounded-[8px] bg-[#1a1a1a] px-[12px] py-[6px] text-[12px] hover:bg-[#2a2a2a] transition-colors">
              <div className="h-[20px] w-[20px] rounded-full bg-gray-600"></div>
              <span className="hidden sm:inline">{profileData?.myProfile?.email || 'name@ticketbooking.com'}</span>
            </button>
          ) : (
            // Not logged in state - show register and login buttons
            <>
              <Link
                href="/sign-up"
                className="hidden h-[32px] items-center justify-center rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px] sm:inline-flex hover:bg-[#2a2a2a] transition-colors"
                data-testid="register-button"
              >
                Бүртгүүлэх
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-[32px] items-center justify-center rounded-[8px] px-[8px] text-[12px] text-black sm:px-[12px] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#00B7F4' }}
                data-testid="login-button"
              >
                Нэвтрэх
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-[20px] right-[20px] z-50 bg-red-600 text-white px-[16px] py-[12px] rounded-[8px] shadow-lg flex items-center gap-[8px] animate-in slide-in-from-right duration-300">
          <span className="text-[14px] font-medium">Нэвтрэх шаардлагатай</span>
          <button 
            onClick={() => setShowToast(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
