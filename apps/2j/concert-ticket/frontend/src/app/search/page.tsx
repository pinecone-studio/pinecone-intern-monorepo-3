'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import EventCard from '@/components/home/EventCard';
import { useSearchConcertsQuery } from '@/generated';
import { Search } from 'lucide-react';

// eslint-disable-next-line complexity
const SearchPageInner: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  // URL-ээс q параметрыг input-д синк хийх
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <EventCard key={it.id} item={it as any} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <div className="mb-[16px] flex items-center gap-[8px]">
          <div className="relative w-[240px] sm:w-[280px]">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEnter()}
              placeholder="Хайлт..."
              className="w-full rounded-[8px] border border-gray-700 bg-[#1a1a1a] py-[10px] pl-[14px] pr-[40px] text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <Search size={18} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Өдөр сонгох - dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex w-[220px] items-center justify-between rounded-[8px] border border-gray-700 bg-[#1a1a1a] px-[12px] py-[10px] text-left text-white"
            >
              <span className="truncate opacity-90">{date ? formatLabel(date) : 'Өдөр сонгох'}</span>
              <span className="opacity-70">▾</span>
            </button>
            {open && (
              <div className="absolute z-[10] mt-[4px] max-h-[260px] w-[220px] overflow-auto rounded-[8px] border border-gray-700 bg-[#111111] p-[4px] shadow-xl">
                <DropdownDates
                  dates={getUniqueDates(items)}
                  selected={date}
                  onSelect={(d) => {
                    setDate(d || undefined);
                    setOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-[8px] bg-red-900/30 p-[12px] text-[12px] text-red-200">Өгөгдөл татахад алдаа гарлаа.</div>
        )}

        {loading ? renderLoading() : items.length === 0 ? renderEmpty() : renderGrid()}
      </main>

      <Footer />
    </div>
  );
};

// Туслах компонент: огнооны жагсаалт
const DropdownDates: React.FC<{ dates: string[]; selected?: string; onSelect: (v: string | null) => void }> = ({ dates, selected, onSelect }) => {
  const all = (
    <button
      onClick={() => onSelect(null)}
      className={`w-full rounded-[6px] px-[10px] py-[8px] text-left text-[13px] hover:bg-white/5 ${!selected ? 'bg-white/5' : ''}`}
    >
      Бүгд
    </button>
  );
  return (
    <div className="flex flex-col gap-[2px]">
      {all}
      {dates.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className={`w-full rounded-[6px] px-[10px] py-[8px] text-left text-[13px] hover:bg-white/5 ${selected === d ? 'bg-white/10' : ''}`}
        >
          {formatLabel(d)}
        </button>
      ))}
    </div>
  );
};

// Өдрүүдийн жагсаалтыг концертуудаас гаргаж авах (YYYY-MM-DD)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUniqueDates = (items: any[]): string[] => {
  const set = new Set<string>();
  for (const it of items) {
    const iso = normalizeDate(it?.date);
    if (iso) set.add(iso);
  }
  return Array.from(set).sort();
};

// YYYY-MM-DD болгон normalize хийх
const normalizeDate = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  // Timestamp эсвэл ISO аль алин дээр ажиллах
  const dt = /^\d+$/.test(dateStr) ? new Date(parseInt(dateStr)) : new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Label (MM.DD)
const formatLabel = (iso: string): string => {
  const [, m, d] = iso.split('-');
  return `${m}.${d}`;
};

// Next.js зөвлөмжийн дагуу Suspense boundary-д боож экспортлох
const Page: React.FC = () => (
  <Suspense fallback={<div className="mx-auto max-w-[1200px] px-[16px] py-[24px] text-white">Ачааллаж байна...</div>}>
    <SearchPageInner />
  </Suspense>
);

export default Page;


