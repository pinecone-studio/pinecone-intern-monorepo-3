'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMyProfileQuery } from '@/generated';

interface Props {
  className?: string;
}

// Dropdown menu component
const ProfileDropdown: React.FC<{
  onNavigateProfile: () => void;
  onSignOut: () => void;
}> = ({ onNavigateProfile, onSignOut }) => (
  <div className="absolute right-0 top-[calc(100%+8px)] w-[180px] bg-[#1a1a1a] rounded-[8px] shadow-lg border border-gray-800 overflow-hidden z-50">
    <button
      onClick={onNavigateProfile}
      className="w-full flex items-center gap-[8px] px-[12px] py-[10px] text-[12px] text-left hover:bg-[#2a2a2a] transition-colors"
    >
      <User size={16} />
      <span>Профайл</span>
    </button>
    <button
      onClick={onSignOut}
      className="w-full flex items-center gap-[8px] px-[12px] py-[10px] text-[12px] text-left hover:bg-[#2a2a2a] transition-colors text-red-400"
    >
      <LogOut size={16} />
      <span>Гарах</span>
    </button>
  </div>
);

// Auth buttons component
const AuthButtons: React.FC = () => (
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
);

// Profile section component
const ProfileSection: React.FC<{
  email: string;
  showDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onToggleDropdown: () => void;
  onNavigateProfile: () => void;
  onSignOut: () => void;
}> = ({ email, showDropdown, dropdownRef, onToggleDropdown, onNavigateProfile, onSignOut }) => (
  <div className="relative" ref={dropdownRef}>
    <button 
      onClick={onToggleDropdown} 
      className="flex items-center gap-[8px] rounded-[8px] bg-[#1a1a1a] px-[12px] py-[6px] text-[12px] hover:bg-[#2a2a2a] transition-colors"
      data-testid="profile-button"
    >
      <div className="h-[20px] w-[20px] rounded-full bg-gray-600"></div>
      <span className="hidden sm:inline">{email}</span>
    </button>
    {showDropdown && (
      <ProfileDropdown
        onNavigateProfile={onNavigateProfile}
        onSignOut={onSignOut}
      />
    )}
  </div>
);

// Custom hook for dropdown outside click handler
const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
};

const Navbar: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // User profile data
  const { data: profileData } = useMyProfileQuery({
    errorPolicy: 'all',
  });

  // Authentication state based on profile data
  const isLoggedIn = !!profileData?.myProfile;

  // Close dropdown when clicking outside
  useOutsideClick(dropdownRef, () => setShowProfileDropdown(false));

  const goSearch = (q?: string) => {
    const keyword = (q ?? query).trim();
    const url = keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search';
    const method = pathname === '/search' ? 'replace' : 'push';
    router[method](url);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      goSearch();
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push('/orders');
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setShowProfileDropdown(false);
    router.push('/');
    window.location.href = '/';
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
            <ProfileSection
              email={profileData?.myProfile?.email || 'name@ticketbooking.com'}
              showDropdown={showProfileDropdown}
              dropdownRef={dropdownRef}
              onToggleDropdown={() => setShowProfileDropdown(!showProfileDropdown)}
              onNavigateProfile={() => {
                setShowProfileDropdown(false);
                router.push('/profile');
              }}
              onSignOut={handleSignOut}
            />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-[20px] right-[20px] z-50 bg-red-600 text-white px-[16px] py-[12px] rounded-[8px] shadow-lg flex items-center gap-[8px] animate-in slide-in-from-right duration-300">
          <span className="text-[14px] font-medium">Нэвтрэх шаардлагатай</span>
          <button onClick={() => setShowToast(false)} className="text-white hover:text-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
