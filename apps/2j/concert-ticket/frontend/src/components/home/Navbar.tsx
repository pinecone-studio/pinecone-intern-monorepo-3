'use client';
import React, { useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
  className?: string;
}

const Navbar: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const goSearch = (q?: string) => {
    const keyword = (q ?? query).trim();
    const url = keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search';
    if (pathname !== '/search') router.push(url);
    else router.replace(url);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      goSearch();
    }
  };

  return (
    <header className={`w-full bg-[#0e0e0e] ${className ?? ''}`}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[12px] py-[8px] sm:px-[16px] sm:py-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="h-[8px] w-[8px] rounded-full bg-cyan-400" />
          <span className="text-[14px] font-semibold tracking-wide">TICKET BOOKING</span>
        </div>

        <div className="flex items-center gap-[12px]">
          <div className="relative h-[32px] w-[180px] overflow-hidden rounded-[8px] bg-[#1a1a1a] sm:h-[36px] sm:w-[240px] md:w-[360px]">
            <input
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

        <div className="flex items-center gap-[12px]">
          <button aria-label="Сагс" className="flex h-[32px] w-[36px] items-center justify-center rounded-[8px] bg-[#1a1a1a] text-[12px] sm:w-[40px]">
            <ShoppingCart size={16} />
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-[8px] rounded-[8px] bg-[#1a1a1a] px-[12px] py-[6px] text-[12px] hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="h-[20px] w-[20px] rounded-full bg-gray-600"></div>
            <span className="hidden sm:inline">name@ticketbooking.com</span>
          </button>
          <button className="hidden h-[32px] items-center justify-center rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px] sm:inline-flex">Бүртгүүлэх</button>
          <button className="inline-flex h-[32px] items-center justify-center rounded-[8px] px-[8px] text-[12px] text-black sm:px-[12px]"
            style={{ backgroundColor: '#00B7F4' }}>Нэвтрэх</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


