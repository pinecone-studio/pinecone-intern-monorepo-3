'use client';

import React, { Suspense, useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import EventCard from '@/components/home/EventCard';
import { useSearchConcertsQuery } from '@/generated';
import { Search, Calendar } from 'lucide-react';
import type { EventItem } from '@/types/Event.type';

interface DateFilterButtonProps {
  date: string | undefined;
  onClick: () => void;
}

const DateFilterButton: React.FC<DateFilterButtonProps> = ({ date, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between gap-[8px] rounded-[8px] bg-transparent px-[16px] py-[10px] text-[14px] text-gray-300 focus:outline-none">
    <span>{date ? new Date(date).toLocaleDateString('mn-MN') : 'Огноо'}</span>
    <Calendar className="h-[16px] w-[16px]" />
  </button>
);

interface DateSelectionPanelProps {
  items: EventItem[];
  date: string | undefined;
  setDate: (date: string) => void;
  onClose: () => void;
}

const DateSelectionPanel: React.FC<DateSelectionPanelProps> = ({ items, date, setDate, onClose }) => {
  const uniqueDates = getUniqueDates(items);

  if (uniqueDates.length === 0) {
    return <div className="absolute left-0 top-full z-10 mt-[8px] w-64 rounded-[8px] border border-gray-800 bg-black p-[8px] text-center text-gray-400">Огноо олдсонгүй</div>;
  }

  return (
    <div className="absolute left-0 top-full z-10 mt-[8px] w-64 rounded-[8px] border border-gray-800 bg-black p-[8px]">
      <div className="grid max-h-40 grid-cols-2 gap-[8px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {uniqueDates.map((d) => (
          <button
            key={d}
            onClick={() => {
              setDate(d);
              onClose();
            }}
            className={`w-full rounded-[8px] border border-gray-700 px-[12px] py-[8px] text-center text-[12px] transition-colors ${
              date === d ? 'bg-[#1a1a1a] text-white' : 'text-gray-300 hover:bg-[#1a1a1a]'
            }`}
          >
            {new Date(d).toLocaleDateString('mn-MN')}
          </button>
        ))}
      </div>
    </div>
  );
};

const SearchPageInner: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const dateFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setKeyword(q);
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="mb-[24px] flex w-full items-center gap-[12px] md:w-1/2">
          <div className="relative flex-grow">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEnter()}
              placeholder="Хайлт..."
              className="w-full rounded-[8px] bg-[#1a1a1a] py-[10px] pl-[14px] pr-[40px] text-white placeholder-gray-400 focus:outline-none"
            />
            <Search size={18} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative" ref={dateFilterRef}>
            <DateFilterButton date={date} onClick={() => setOpen(!open)} />
            {open && <DateSelectionPanel items={items} date={date} setDate={setDate} onClose={() => setOpen(false)} />}
          </div>
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
