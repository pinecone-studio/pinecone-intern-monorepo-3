'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface HeroSliderProps {
  title: string;
  artist: string;
  dates: string[];
  backgroundImage?: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  title,
  artist,
  dates,
  backgroundImage = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
}) => {
  return (
    <section className="relative w-full h-[250px] overflow-hidden" data-testid="hero-slider">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex items-start gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Artist Name with rounded border */}
              <h2
                className="inline-block px-3 py-1 mb-6 text-white border border-gray-300 rounded-full"
                style={{
                  fontFamily: 'GIP, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 300,
                  fontSize: '12px',
                  letterSpacing: '0.02em',
                  fontStyle: 'normal',
                }}
                data-testid="artist-name"
              >
                {artist}
              </h2>

              {/* Main Title */}
              <h1
                className="mb-8 text-white font-bold"
                style={{
                  fontFamily: 'GIP, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '48px',
                  lineHeight: '32px',
                  letterSpacing: '0.02em',
                  fontStyle: 'normal',
                }}
                data-testid="concert-title"
              >
                {title}
              </h1>

              {/* Dates */}
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-gray-400" data-testid="calendar-icon" />
                <div className="flex items-center gap-2" data-testid="dates">
                  {dates.map((date, index) => (
                    <React.Fragment key={index}>
                      <span className="text-sm font-medium">{date}</span>
                      {index < dates.length - 1 && <span className="text-gray-400">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
