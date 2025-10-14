import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Props {
  className?: string;
}

// Simple hero banner (static slide UI)
const HeroCarousel: React.FC<Props> = ({ className }) => {
  return (
    <section className={`relative h-[280px] w-full overflow-hidden rounded-[12px] bg-[#141414] ${className ?? ''}`}>
      <img
        src="/images/hero-placeholder.png"
        alt="Hero"
        className="absolute left-0 top-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative z-[1] flex h-full flex-col items-center justify-center p-[24px] text-center">
        <div className="mb-[8px] rounded-[9999px] bg-black/40 px-[10px] py-[4px] text-[12px] text-gray-200 backdrop-blur-[2px]">coldplay</div>
        <h2 className="text-[44px] font-extrabold leading-[52px] sm:text-[36px] sm:leading-[42px]">MUSIC of the SPHERES</h2>
        <div className="mt-[10px] flex items-center gap-[8px] text-[12px] text-gray-200">
          <Calendar size={14} />
          <span>10.31</span>
          <span>11:01</span>
        </div>
      </div>

      <button
        aria-label="Previous"
        className="absolute left-[12px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Next"
        className="absolute right-[12px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
};

export default HeroCarousel;


