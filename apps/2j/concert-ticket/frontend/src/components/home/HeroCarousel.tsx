'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useHomeEventsQuery } from '@/generated';

interface Props {
  className?: string;
}

// Dynamic hero banner - data connected + simple navigation
// eslint-disable-next-line complexity
const HeroCarousel: React.FC<Props> = ({ className }) => {
  const { data } = useHomeEventsQuery({ variables: { limit: 20, offset: 0 } });
  const items = data?.concerts.concerts ?? [];

  // initial index: Coldplay / Music of the Spheres, else first
  const initialIndex = useMemo(() => {
    if (!items.length) return 0;
    const keyword = 'music of the spheres';
    const idx = items.findIndex((c) => c.name?.toLowerCase().includes(keyword));
    return idx >= 0 ? idx : 0;
  }, [items]);

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(initialIndex), [initialIndex]);

  // Auto-slide every 1 minute
  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 60000); // 1 minute (60 seconds) for very slow auto-slide
    return () => clearInterval(interval);
  }, [items.length]);

  const prev = () => {
    if (!items.length) return;
    setIndex((i) => (i - 1 + items.length) % items.length);
  };
  const next = () => {
    if (!items.length) return;
    setIndex((i) => (i + 1) % items.length);
  };

  const formatDate = (dateStr?: string, _timeStr?: string): string => {
    if (!dateStr) return '';
    const dt = /^\d+$/.test(dateStr) ? new Date(parseInt(dateStr)) : new Date(dateStr);
    if (isNaN(dt.getTime())) return '';
    const tz = 'Asia/Ulaanbaatar';
    const mm = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: '2-digit' }).format(dt);
    const dd = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: '2-digit' }).format(dt);
    return `${mm}.${dd}`;
  };

  return (
    <section className={`relative h-[540px] w-full overflow-hidden rounded-[12px] bg-[#141414] ${className ?? ''}`}>
      {/* Image slider container */}
      <div className="relative h-full w-full">
        <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((item, idx) => {
            const itemDate = formatDate(item.date, item.time);
            return (
              <div key={idx} className="relative h-full w-full flex-shrink-0">
                <img
                  src={item?.image ?? '/images/hero-placeholder.png'}
                  alt={item?.name ?? 'Hero'}
                  className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover object-top opacity-60"
                />
                {/* Text content for each slide */}
                <div className="relative z-[1] flex h-full flex-col items-center justify-center p-[24px] text-center">
                  <div className="mb-[8px] rounded-full border border-white px-[10px] py-[4px] text-[12px] font-extralight text-gray-200" style={{ borderWidth: '0.1px' }}>
                    {item?.mainArtist?.name ?? ''}
                  </div>
                  <h2 className="text-[48px] font-extrabold leading-[56px] sm:text-[40px] sm:leading-[48px]">{item?.name ?? 'MUSIC of the SPHERES'}</h2>
                  <div className="mt-[10px] flex items-center gap-[8px] text-[12px] text-gray-200">
                    <Calendar className="h-[14px] w-[14px]" />
                    <span>{itemDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-[12px] top-1/2 z-[2] flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button aria-label="Next" onClick={next} className="absolute right-[12px] top-1/2 z-[2] flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white">
        <ChevronRight size={20} />
      </button>
    </section>
  );
};

export default HeroCarousel;
