'use client';

import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';

interface Props {
  className?: string;
}

// Navbar компонент: Search хэсэг зөвхөн UI, ямар ч үйлдэл хийгдэхгүй
const Navbar: React.FC<Props> = ({ className }) => {
  return (
    <header className={`w-full bg-[#0e0e0e] ${className ?? ''}`}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[12px] py-[8px] sm:px-[16px] sm:py-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="h-[8px] w-[8px] rounded-full bg-cyan-400" />
          <Link href="/" className="text-[14px] font-semibold tracking-wide hover:text-cyan-400 transition-colors">
            TICKET BOOKING
          </Link>
        </div>

        {/* Фигматай тааруулж: зөвхөн хайлт талбар үлдээнэ */}
        <div className="flex items-center gap-[12px]">
          <div className="relative h-[32px] w-[180px] overflow-hidden rounded-[8px] bg-[#1a1a1a] sm:h-[36px] sm:w-[240px] md:w-[360px]">
            <input className="h-full w-full bg-transparent px-[8px] pr-[28px] text-[12px] outline-none sm:px-[12px] sm:pr-[34px]" placeholder="Хайх..." readOnly />
            <span className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#b3b3b3]">
              <Search size={16} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[12px]">
          {/* cart icon button */}
          <button aria-label="Сагс" className="flex h-[32px] w-[36px] items-center justify-center rounded-[8px] bg-[#1a1a1a] text-[12px] sm:w-[40px] hover:bg-[#2a2a2a] transition-colors">
            <ShoppingCart size={16} />
          </button>

          {/* Authentication buttons - will be handled by Clerk components */}
          <Link href="/sign-up" className="hidden h-[32px] items-center justify-center rounded-[8px] bg-[#1a1a1a] px-[12px] text-[12px] sm:inline-flex hover:bg-[#2a2a2a] transition-colors">
            Бүртгүүлэх
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-[32px] items-center justify-center rounded-[8px] px-[8px] text-[12px] text-black sm:px-[12px] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#00B7F4' }}
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
