'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export const ConcertDetails: React.FC<ConcertDetailsProps> = ({ eventDate, eventTime, venue, specialArtists, schedule, ticketCategories, onBookTicket }) => {
  const router = useRouter();
  const relatedEvents: RelatedEvent[] = [
    {
      id: '1',
      title: 'Music of the Spheres',
      artist: 'coldplay',
      price: 200000,
      date: '10.31',
      venue: 'UG ARENA',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      discount: 20,
    },
    {
      id: '2',
      title: 'Summer Festival',
      artist: 'Various Artists',
      price: 150000,
      date: '11.15',
      venue: 'UG ARENA',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27c1a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3',
      title: 'Rock Night',
      artist: 'Rock Band',
      price: 120000,
      date: '11.20',
      venue: 'UG ARENA',
      image: 'https://images.unsplash.com/photo-1571266028243-d220c4b3b0c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
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

            <div>
              <h3 className="mb-3 text-lg font-light text-gray-400">Special Artist</h3>
              <ul className="space-y-2">
                {specialArtists.map((artist, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="font-bold text-white">•</span>
                    <span className="font-bold text-white">{artist}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-light text-gray-400">Тоглолтийн цагийн хуваарь:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-white">•</span>
                  <span className="font-bold text-white">Door open: {schedule.doorOpen}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-white">•</span>
                  <span className="font-bold text-white">Music start: {schedule.musicStart}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-light text-gray-400">Stage plan:</h3>
              <div className="relative w-3/4 mx-auto overflow-hidden rounded-lg">
                <Image src="/images/stage-plan.png" alt="Stage Plan" width={450} height={300} className="w-full h-auto" />
              </div>
            </div>
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
              <div className="space-y-3">
                {ticketCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-black border border-gray-600 rounded-lg" style={{ borderStyle: 'dashed', borderWidth: '1px' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span className="font-medium" style={{ color: category.color }}>
                        {category.name} ({category.available})
                      </span>
                    </div>
                    <span className="font-light text-white">{category.price.toLocaleString()}₮</span>
                  </div>
                ))}
              </div>
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

        <div className="mt-12">
          <h3 className="mb-6 text-lg font-light text-left text-gray-400">Холбоотой эвент болон тоглолтууд</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedEvents.map((event) => (
              <div key={event.id} className="overflow-hidden rounded-lg" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
                <div className="relative">
                  <img src={event.image} alt={event.title} className="object-cover w-full h-48" />
                  {event.discount && <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded top-2 left-2">{event.discount}%</div>}
                </div>
                <div className="p-4">
                  <h4 className="mb-1 text-lg font-light text-white">{event.title}</h4>
                  <p className="mb-4 text-sm font-light text-gray-400">{event.artist}</p>

                  <div className="mb-4">
                    <span className="text-xl font-bold text-white">{event.price.toLocaleString()}₮</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcertDetails;
