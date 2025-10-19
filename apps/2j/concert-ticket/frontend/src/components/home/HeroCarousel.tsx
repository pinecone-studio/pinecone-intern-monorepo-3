'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useHomeEventsQuery } from '@/generated';

interface Props {
  className?: string;
}

const CarouselNavigation = ({ onPrev, onNext, disabled }: { onPrev: () => void; onNext: () => void; disabled: boolean }) => (
  <>
    <button
      aria-label="Previous"
      onClick={onPrev}
      disabled={disabled}
      className="absolute left-[16px] top-1/2 -translate-y-1/2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 disabled:opacity-50"
    >
      <ChevronLeft className="h-[20px] w-[20px]" />
    </button>
    <button
      aria-label="Next"
      onClick={onNext}
      disabled={disabled}
      className="absolute right-[16px] top-1/2 -translate-y-1/2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 disabled:opacity-50"
    >
      <ChevronRight className="h-[20px] w-[20px]" />
    </button>
  </>
);

const formatCarouselDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const dt = /^\d+$/.test(dateStr) ? new Date(parseInt(dateStr)) : new Date(dateStr);
  if (isNaN(dt.getTime())) return '';
  const tz = 'Asia/Ulaanbaatar';
  const mm = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: '2-digit' }).format(dt);
  const dd = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: '2-digit' }).format(dt);
  return `${mm}.${dd}`;
};

interface CarouselItem {
  id: string;
  name?: string;
}

const useCarouselIndex = (items: CarouselItem[]) => {
  const initialIndex = useMemo(() => {
    if (!items.length) return 0;
    const idx = items.findIndex((c) => c.name?.toLowerCase().includes('music of the spheres'));
    return idx >= 0 ? idx : 0;
  }, [items]);

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(initialIndex), [initialIndex]);

  const prev = () => items.length && setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => items.length && setIndex((i) => (i + 1) % items.length);

  return { index, prev, next };
};

interface CurrentEvent {
  name?: string;
  image?: string;
  date?: string;
  mainArtist?: { name?: string };
}

const CarouselContent = ({ current }: { current: CurrentEvent | undefined }) => (
  <div className="relative z-[1] flex h-full flex-col items-center justify-center p-[24px] text-center">
    <div className="mb-[8px] rounded-[9999px] bg-black/40 px-[10px] py-[4px] text-[12px] text-gray-200 backdrop-blur-[2px]">{current?.mainArtist?.name ?? ''}</div>
    <h2 className="text-[44px] font-extrabold leading-[52px] sm:text-[36px] sm:leading-[42px]">{current?.name ?? 'MUSIC of the SPHERES'}</h2>
    <div className="mt-[10px] flex items-center gap-[8px] text-[12px] text-gray-200">
      <Calendar size={14} />
      <span>{formatCarouselDate(current?.date)}</span>
    </div>
  </div>
);

const HeroCarousel: React.FC<Props> = ({ className }) => {
  const { data } = useHomeEventsQuery({ variables: { limit: 20, offset: 0 } });
  const items = data?.concerts.concerts ?? [];
  const { index, prev, next } = useCarouselIndex(items);
  const current = items[index];

  return (
    <section className={`relative h-[540px] w-full overflow-hidden rounded-[12px] bg-[#141414] ${className ?? ''}`}>
      <img
        src={current?.image ?? '/images/hero-placeholder.png'}
        alt={current?.name ?? 'Hero'}
        className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover object-top opacity-60"
      />
      <CarouselContent current={current} />
      <CarouselNavigation onPrev={prev} onNext={next} disabled={!items.length} />
    </section>
  );
};

export default HeroCarousel;
