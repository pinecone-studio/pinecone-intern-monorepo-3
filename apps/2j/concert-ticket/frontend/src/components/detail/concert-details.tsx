'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RelatedEvents } from './related-events';
import { TicketCategories } from './ticket-categories';
import { ConcertSchedule } from './concert-schedule';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
}

interface RelatedEvent {
  id: string;
  title: string;
  artist: string;
  price: number;
  date: string;
  venue: string;
  image: string;
  discount?: number;
}

interface ConcertDetailsProps {
  eventDate: string;
  eventTime: string;
  venue: string;
  specialArtists: string[];
  schedule: {
    doorOpen: string;
    musicStart: string;
  };
  ticketCategories: TicketCategory[];
  onBookTicket: () => void;
}

export const ConcertDetails: React.FC<ConcertDetailsProps> = ({ eventDate, eventTime, venue, specialArtists, schedule, ticketCategories, onBookTicket: _onBookTicket }) => {
  const router = useRouter();
  const relatedEvents: RelatedEvent[] = [
    {
      id: '1',
      title: 'Music of the Spheres',
      artist: 'coldplay',
      price: 200000,
      date: '10.31',
      venue: 'UG ARENA',
      image: '/images/concert-1.jpg',
      discount: 20,
    },
    {
      id: '2',
      title: 'Summer Festival',
      artist: 'Various Artists',
      price: 150000,
      date: '11.15',
      venue: 'UG ARENA',
      image: '/images/concert-2.jpg',
    },
    {
      id: '3',
      title: 'Rock Night',
      artist: 'Rock Band',
      price: 120000,
      date: '11.20',
      venue: 'UG ARENA',
      image: '/images/concert-3.jpg',
      discount: 20,
    },
  ];

  return (
    <section className="py-8 text-white bg-black" data-testid="concert-details">
      <div className="max-w-6xl px-6 mx-auto mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5" style={{ color: '#FAFAFA' }} />
                <span className="text-lg font-medium text-white">{eventDate}</span>
                <Clock className="w-5 h-5" style={{ color: '#FAFAFA' }} />
                <span className="text-lg font-medium text-white">{eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: '#FAFAFA' }} />
                <span className="text-lg font-bold text-white underline">{venue}</span>
              </div>
            </div>

            <ConcertSchedule
              eventDate={eventDate}
              eventTime={eventTime}
              venue={venue}
              specialArtists={specialArtists}
              schedule={[`Door open: ${schedule.doorOpen}`, `Music start: ${schedule.musicStart}`]}
            />
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div>
              <h3 className="mb-4 text-lg font-light text-gray-400">Тоглолт үзэх өдрөө сонгоно уу.</h3>
              <div className="relative">
                <select className="w-full px-4 py-2 pr-10 text-white rounded-lg appearance-none" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
                  <option>Өдөр сонгох</option>
                  <option>2024.11.15</option>
                  <option>2024.11.16</option>
                  <option>2024.11.17</option>
                  <option>2024.11.18</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <TicketCategories ticketCategories={ticketCategories} onBookTicket={() => router.push('/cart')} />
            </div>

            <button
              onClick={() => router.push('/cart')}
              className="w-full px-6 py-4 font-bold text-white transition-colors rounded-lg"
              style={{ backgroundColor: '#00b7f4' }}
              data-testid="book-ticket-button"
            >
              Тасалбар захиалах
            </button>
          </div>
        </div>

        <RelatedEvents events={relatedEvents} />
      </div>
    </section>
  );
};

export default ConcertDetails;
