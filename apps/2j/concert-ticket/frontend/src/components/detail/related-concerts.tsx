'use client';

import React from 'react';
import Link from 'next/link';
import { useHomeEventsQuery, TicketType } from '@/generated';

const getTicketTypeName = (type: TicketType): string => {
  switch (type) {
    case TicketType.Vip:
      return 'VIP тасалбар';
    case TicketType.Regular:
      return 'Энгийн тасалбар';
    case TicketType.GeneralAdmission:
      return 'Арын тасалбар';
    default:
      return 'Тасалбар';
  }
};

const getLowestPrice = (categories: any[]): number | null => {
  if (!categories || categories.length === 0) return null;

  const prices = categories.filter((cat) => cat.unitPrice && !isNaN(cat.unitPrice)).map((cat) => cat.unitPrice);

  return prices.length > 0 ? Math.min(...prices) : null;
};

const formatDateTime = (date: string, time: string): string => {
  try {
    const eventDate = new Date(date);
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  } catch {
    return date;
  }
};

interface RelatedConcertsProps {
  excludeConcertId: string;
}

export const RelatedConcerts: React.FC<RelatedConcertsProps> = ({ excludeConcertId }) => {
  const { data, loading, error } = useHomeEventsQuery({
    variables: { limit: 6, offset: 0 },
  });

  if (loading) {
    return null;
  }

  if (error || !data?.concerts?.concerts) {
    return null;
  }

  const relatedConcerts = data.concerts.concerts.filter((concert) => concert.id !== excludeConcertId).slice(0, 3);

  if (relatedConcerts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-black">
      <div className="max-w-6xl px-6 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-white">Холбоотой эвент болон тоглолтууд</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedConcerts.map((concert) => {
            const lowestPrice = getLowestPrice(concert.ticketCategories || []);

            return (
              <Link key={concert.id} href={`/concerts/${concert.id}`}>
                <div className="overflow-hidden transition-transform bg-gray-900 rounded-lg hover:scale-105 ring-1 ring-white/5">
                  <div className="h-40 w-full bg-gray-800">
                    {concert.image ? (
                      <img src={concert.image} alt={concert.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">{concert.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4" style={{ backgroundColor: '#1f1f1f' }}>
                    <div className="mb-2 text-sm text-gray-400">{concert.mainArtist?.name || 'Unknown Artist'}</div>
                    <div className="mb-3 line-clamp-2 text-lg font-semibold text-white">{concert.name}</div>
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
                      <span className="font-medium text-white">{lowestPrice ? `${lowestPrice.toLocaleString()}₮` : 'Price TBA'}</span>
                      <span>{concert.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDateTime(concert.date, concert.time)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
