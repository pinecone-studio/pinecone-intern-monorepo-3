'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface HeroSliderProps {
  title: string;
  artist: string;
  dates: string[];
  backgroundImage?: string;
  className?: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ title, artist, dates, backgroundImage = '/images/hero-bg.jpg', className }) => {
  return (
    <section className={`relative w-full h-[300px] overflow-hidden ${className ?? ''}`} data-testid="hero-slider">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex items-center h-full">
        <div className="w-full">
          <div className="flex items-start gap-6">
            <div className="flex-1">
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
