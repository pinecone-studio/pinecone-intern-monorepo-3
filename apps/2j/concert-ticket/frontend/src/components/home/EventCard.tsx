import React from 'react';
import { EventItem } from '@/types/Event.type';

interface Props {
  item: EventItem;
}

const EventCard: React.FC<Props> = ({ item }) => {
  const categories = Array.isArray((item as any).ticketCategories) ? (item as any).ticketCategories : [];
  const lowestPrice =
    categories.length > 0
      ? categories.reduce((min: number, t: any) => Math.min(min, t.unitPrice), Number.POSITIVE_INFINITY)
      : undefined;

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return '';
    // Compose to local Date using provided date and time (fallback 00:00)
    const iso = `${dateStr}T${timeStr ?? '00:00'}:00`;
    const dt = new Date(iso);
    try {
      const tz = 'Asia/Ulaanbaatar';
      const mm = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: '2-digit' }).format(dt);
      const dd = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: '2-digit' }).format(dt);
      const hh = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false }).format(dt);
      const min = new Intl.DateTimeFormat('en-US', { timeZone: tz, minute: '2-digit' }).format(dt);
      return `${mm}.${dd} ${hh}:${min}`;
    } catch {
      return `${dateStr}${timeStr ? ` ${timeStr}` : ''}`;
    }
  };

  return (
    <div className="overflow-hidden rounded-[12px] bg-[#111111] ring-1 ring-white/5">
      <div className="h-[140px] w-full bg-[#1a1a1a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image ?? '/images/placeholder.jpg'} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-[12px]">
        <div className="text-[12px] text-gray-400">{item.mainArtist?.name}</div>
        <div className="mt-[4px] line-clamp-2 text-[14px] font-semibold">{item.name}</div>
        <div className="mt-[8px] flex items-center justify-between text-[12px] text-gray-300">
          <span>{lowestPrice == null || !isFinite(lowestPrice) ? '-' : `${lowestPrice.toLocaleString()}₮`}</span>
          <span>{item.venue}</span>
        </div>
        <div className="mt-[6px] flex items-center gap-[8px] text-[12px] text-gray-400">
          <span>{formatDateTime(item.date as any, item.time as any)}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;


