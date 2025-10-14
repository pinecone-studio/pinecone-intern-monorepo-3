import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

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

interface RelatedEventsProps {
  events: RelatedEvent[];
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ events }) => {
  return (
    <div className="mt-12">
      <h3 className="mb-6 text-lg font-light text-left text-gray-400">Холбоотой эвент болон тоглолтууд</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
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
  );
};
