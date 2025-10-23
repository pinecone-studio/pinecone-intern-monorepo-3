'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import EventCard from '@/components/home/EventCard';
import { useSearchConcertsQuery } from '@/generated';
import { Search, Calendar } from 'lucide-react';
import type { EventItem } from '@/types/Event.type';

interface SearchFiltersProps {
  date: string | undefined;
  setDate: (date: string | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  items: EventItem[];
}

const SearchFilters = ({ date, setDate, open, setOpen, items }: SearchFiltersProps) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <div className="relative" ref={modalRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-[5px] rounded-[8px] bg-[#1a1a1a] px-[16px] py-[9px] text-[14px] text-gray-300 hover:bg-gray-800">
        <Calendar className="h-[16px] w-[16px]" />
        {date ? new Date(date).toLocaleDateString('mn-MN') : 'Огноо сонгох'}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-[16px] h-[180px] w-64 overflow-y-auto rounded-[8px] bg-[#1a1a1a] bg-opacity-80 p-[16px]">
          <div className="grid grid-cols-2 gap-2">
            {getUniqueDates(items).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDate(date === d ? undefined : d);
                  setOpen(false);
                }}
                style={{ borderWidth: '0.1px' }}
                className={`rounded-[6px] border border-white px-[12px] py-[6px] text-[12px] transition-colors ${
                  date === d ? 'bg-[#1a1a1a]/95 text-white' : 'bg-[#1a1a1a]/95 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {new Date(d).toLocaleDateString('mn-MN')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchPageInner: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setKeyword(q);
  }, [searchParams]);

  const [date, setDate] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const variables = useMemo(() => ({ name: keyword || undefined, date, limit: 12, offset: 0 }), [keyword, date]);
  const { data, loading, error } = useSearchConcertsQuery({ variables });

  const items = data?.concerts.concerts ?? [];

  const onEnter = () => {
    const url = keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search';
    router.replace(url);
  };

  const renderLoading = () => (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[216px] animate-pulse rounded-[12px] bg-[#111111]" />
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-[80px] text-gray-400">
      <div className="mb-[8px] text-[24px]">♡</div>
      <div>Илэрц олдсонгүй</div>
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 md:grid-cols-3">
      {items.map((it) => (
        <EventCard key={it.id} item={it as EventItem} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <div className="mb-[24px] flex items-center gap-[5px]">
          <div className="relative w-[240px] sm:w-[280px]">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEnter()}
              placeholder="Хайлт..."
              className="w-full rounded-[8px] border-none bg-[#1a1a1a] py-[8px] pl-[14px] pr-[40px] text-white placeholder-gray-400 focus:outline-none"
            />
            <Search size={18} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <SearchFilters date={date} setDate={setDate} open={open} setOpen={setOpen} items={items} />
        </div>

        {error && <div className="rounded-[8px] bg-red-900/30 p-[12px] text-[12px] text-red-200">Өгөгдөл татахад алдаа гарлаа.</div>}

        {loading ? renderLoading() : items.length === 0 ? renderEmpty() : renderGrid()}
      </main>

      <Footer />
    </div>
  );
};

const getUniqueDates = (items: EventItem[]): string[] => {
  const set = new Set<string>();
  for (const it of items) {
    const iso = normalizeDate(it?.date);
    if (iso) set.add(iso);
  }
  return Array.from(set).sort();
};

const normalizeDate = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  const dt = /^\d+$/.test(dateStr) ? new Date(parseInt(dateStr)) : new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const Page: React.FC = () => (
  <Suspense fallback={<div className="mx-auto max-w-[1200px] px-[16px] py-[24px] text-white">Ачааллаж байна...</div>}>
    <SearchPageInner />
  </Suspense>
);

export default Page;
