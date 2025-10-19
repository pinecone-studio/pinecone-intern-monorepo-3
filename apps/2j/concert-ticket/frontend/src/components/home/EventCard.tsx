import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import type { EventItem } from '@/types/Event.type';
import { getLowestPrice, formatDateTime } from './EventCard.utils';

interface Props {
  item: EventItem;
}

const EventCard: React.FC<Props> = ({ item }) => {
  const categories = Array.isArray(item.ticketCategories) ? item.ticketCategories : [];
  const lowestPrice = getLowestPrice(categories);

  const formatPrice = (price: number | undefined): string => {
    if (price == null || !isFinite(price)) return '-';
    return `${Math.floor(price).toLocaleString('en-US').replace(/,/g, "'")}$`;
  };

  return (
    <Link href={`/concerts/${item.id}`}>
      <div className="overflow-hidden rounded-[12px] bg-[#111111] ring-1 ring-white/5">
        <div className="h-[180px] w-full bg-[#1a1a1a]">
          <Image
            src={item.image ?? '/images/placeholder.jpg'}
            alt={item.name}
            width={600}
            height={180}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <div className="p-[12px]">
          <div className="line-clamp-2 text-[16px] font-bold leading-[20px]">{item.name}</div>
          <div className="mt-[4px] text-[12px] text-gray-400">{item.mainArtist?.name}</div>
          <div className="mt-[8px] text-[14px] font-semibold text-white">
            <span>{formatPrice(lowestPrice)}</span>
          </div>
          <div className="mt-[8px] flex items-center justify-between text-[12px] text-gray-400">
            <div className="flex items-center gap-[4px]">
              <Calendar size={14} />
              <span>{formatDateTime(item.date, item.time)}</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <MapPin size={14} />
              <span>{item.venue}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
