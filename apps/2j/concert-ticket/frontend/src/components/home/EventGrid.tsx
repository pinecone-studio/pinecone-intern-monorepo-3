"use client";
import React from 'react';
import EventCard from '@/components/home/EventCard';
import { useHomeEventsQuery } from '@/generated';

interface Props {
  className?: string;
}

const SkeletonCard = () => (
  <div className="h-[216px] animate-pulse rounded-[12px] bg-[#111111]" />
);

const EventGrid: React.FC<Props> = ({ className }) => {
  const { data, loading, error } = useHomeEventsQuery({ variables: { limit: 12, offset: 0 } });

  if (error) {
    return (
      <div className="rounded-[8px] bg-red-900/30 p-[12px] text-[12px] text-red-200">
        Өгөгдөл татахад алдаа гарлаа.
      </div>
    );
  }

  const items = data?.concerts.concerts ?? [];

  return (
    <section className={className ?? ''}>
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 md:grid-cols-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((it) => <EventCard key={it.id} item={it as any} />)}
      </div>
    </section>
  );
};

export default EventGrid;


