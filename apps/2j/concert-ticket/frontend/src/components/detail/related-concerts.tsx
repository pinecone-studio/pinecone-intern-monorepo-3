'use client';

import React from 'react';
import Link from 'next/link';
import { useHomeEventsQuery } from '@/generated';

// const getTicketTypeName = (type: TicketType): string => {
//   switch (type) {
//     case TicketType.Vip:
//       return 'VIP тасалбар';
//     case TicketType.Regular:
//       return 'Энгийн тасалбар';
//     case TicketType.GeneralAdmission:
//       return 'Арын тасалбар';
//     default:
//       return 'Тасалбар';
//   }
// };

const getLowestPrice = (categories: any[]): number | null => {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!categories || categories.length === 0) return null;

  const prices = categories.filter((cat) => cat.unitPrice && !isNaN(cat.unitPrice)).map((cat) => cat.unitPrice);

  return prices.length > 0 ? Math.min(...prices) : null;
};

const formatDateTime = (dateStr: string, _time: string): string => {
  try {
    let date: Date;
    // Timestamp эсэхийг шалгах (10-13 оронтой тоо)
    if (/^\d{10,13}$/.test(dateStr)) {
      const timestamp = parseInt(dateStr, 10);
      // Unix timestamp (секунд) бол миллисекунд болгох
      date = new Date(timestamp * (String(timestamp).length === 10 ? 1000 : 1));
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  } catch {
    return dateStr;
  }
};

interface RelatedConcertsProps {
  excludeConcertId: string;
}

export const RelatedConcerts: React.FC<RelatedConcertsProps> = ({ excludeConcertId }) => {
  const { data, loading, error } = useHomeEventsQuery({
    variables: { limit: 7, offset: 0 },
  });

  if (loading) {
    return null;
  }

  if (error || !data?.concerts?.concerts) {
    return null;
  }

  const relatedConcerts = data.concerts.concerts.filter((concert) => concert.id !== excludeConcertId).slice(0, 6);

  if (relatedConcerts.length === 0) {
    return null;
  }

  return (
    <div className="py-16">
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
                  <div className="mb-3 truncate text-lg font-semibold text-white">{concert.name}</div>
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
  );
};
