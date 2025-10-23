import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EventCard from '../../../src/components/home/EventCard';
import type { EventItem } from '../../../src/types/Event.type';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockEvent: EventItem = {
  id: 'test-1',
  name: 'Test Concert',
  date: '2024-12-25',
  time: '19:00',
  venue: 'Test Venue',
  image: '/test.jpg',
  mainArtist: { name: 'Test Artist', id: 'artist-1' },
  ticketCategories: [
    { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 50 },
    { id: '2', type: 'REGULAR', unitPrice: 50000, availableQuantity: 100 },
  ],
};

describe('EventCard', () => {
  it('renders event name', () => {
    render(<EventCard item={mockEvent} />);
    expect(screen.getByText('Test Concert')).toBeInTheDocument();
  });

  it('renders artist name', () => {
    render(<EventCard item={mockEvent} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders venue', () => {
    render(<EventCard item={mockEvent} />);
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('displays lowest price', () => {
    render(<EventCard item={mockEvent} />);
    expect(screen.getByText("50'000₮")).toBeInTheDocument();
  });

  it('renders with empty ticket categories', () => {
    const event = { ...mockEvent, ticketCategories: [] };
    render(<EventCard item={event} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders without artist', () => {
    const event = { ...mockEvent, mainArtist: undefined };
    render(<EventCard item={event} />);
    expect(screen.getByText('Test Concert')).toBeInTheDocument();
  });

  it('uses placeholder image when no image provided', () => {
    const event = { ...mockEvent, image: null };
    render(<EventCard item={event} />);
    const img = screen.getByAltText('Test Concert');
    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('handles non-array ticket categories', () => {
    const event = { ...mockEvent, ticketCategories: null as unknown as typeof mockEvent.ticketCategories };
    render(<EventCard item={event} />);
    expect(screen.getByText('Test Concert')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
