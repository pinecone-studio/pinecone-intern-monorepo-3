import React from 'react';
import type { EventItem, TicketCategory } from '@/types/Event.type';
import { getLowestPrice, formatDateTime } from './EventCard.utils';

interface Props {
  item: EventItem;
}

const EventCard: React.FC<Props> = ({ item }) => {
  // TicketCategory төрлийг ирээдүйд ашиглах тул type-level хэрэглээг хадгална
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type __KeepTicketCategory__ = TicketCategory;
  const categories = Array.isArray(item.ticketCategories) ? item.ticketCategories : [];
  const lowestPrice = getLowestPrice(categories);

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
          <span>{formatDateTime(item.date, item.time)}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;


