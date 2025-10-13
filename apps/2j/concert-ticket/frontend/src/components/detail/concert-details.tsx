'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  available: number;
  color: string;
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
  return (
    <section className="py-8 text-white bg-black" data-testid="concert-details">
      <div className="max-w-[1400px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Panel - Concert Information */}
          <div className="space-y-6">
            {/* Event Date, Time and Venue */}
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

            {/* Special Artists */}
            <div>
              <h3 className="mb-3 text-xl font-thin" style={{ color: '#FAFAFA' }}>
                Special Artist
              </h3>
              <ul className="space-y-2">
                {specialArtists.map((artist, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="font-bold text-white">•</span>
                    <span className="font-bold text-white">{artist}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concert Schedule */}
            <div>
              <h3 className="mb-3 text-xl font-thin" style={{ color: '#FAFAFA' }}>
                Тоглолтийн цагийн хуваарь:
              </h3>
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

            {/* Stage Plan */}
            <div>
              <h3 className="mb-3 text-xl font-bold">Stage plan:</h3>
              <div className="relative w-3/4 mx-auto overflow-hidden rounded-lg">
                <Image src="/images/stage-plan.png" alt="Stage Plan" width={450} height={300} className="w-full h-auto" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="text-white font-bold text-sm">ТАЙЗ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Options */}
          <div className="space-y-6 max-w-md">
            {/* Date Selection */}
            <div>
              <p className="mb-4 text-white font-normal">Тоглолт үзэх өдрөө сонгоно уу.</p>
              <div className="relative">
                <select className="w-full px-4 py-2 text-white rounded-lg appearance-none pr-10" style={{ backgroundColor: '#1f1f1f', border: '1px solid #27272a' }}>
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

            {/* Ticket Categories */}
            <div>
              <h3 className="mb-4 text-xl font-bold">Тасалбарын ангилал</h3>
              <div className="space-y-3">
                {ticketCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-black border border-gray-600 rounded-lg" style={{ borderStyle: 'dashed', borderWidth: '1px' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span className="font-medium" style={{ color: category.id === '2' ? '#4651c9' : category.id === '3' ? '#c772c4' : 'white' }}>
                        {category.name} ({category.available})
                      </span>
                    </div>
                    <span className="text-white font-light">{category.price.toLocaleString()}₮</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Ticket Button */}
            <button onClick={onBookTicket} className="w-full px-6 py-4 font-bold text-white transition-colors rounded-lg" style={{ backgroundColor: '#00b7f4' }} data-testid="book-ticket-button">
              Тасалбар захиалах
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcertDetails;
