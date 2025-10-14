import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface ConcertScheduleProps {
  eventDate: string;
  eventTime: string;
  venue: string;
  specialArtists: string[];
  schedule: string[];
}

export const ConcertSchedule: React.FC<ConcertScheduleProps> = ({ eventDate, eventTime, venue, specialArtists, schedule }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-light text-gray-400">Special Artist</h3>
        <div className="flex flex-wrap gap-2">
          {specialArtists.map((artist, index) => (
            <span key={index} className="px-3 py-1 text-sm text-white bg-gray-700 rounded-full">
              {artist}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-light text-gray-400">Тоглолтийн цагийн хуваарь:</h3>
        <div className="space-y-2">
          {schedule.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-light text-gray-400">Stage plan:</h3>
        <div className="relative">
          <img src="/images/stage-plan.png" alt="Stage Plan" className="w-full h-auto rounded-lg" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{eventDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{eventTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{venue}</span>
        </div>
      </div>
    </div>
  );
};
