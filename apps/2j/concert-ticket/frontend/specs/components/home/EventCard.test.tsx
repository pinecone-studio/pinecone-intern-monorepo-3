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
    { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 50, discountPercentage: 20, discountedPrice: 80000 },
    { id: '2', type: 'REGULAR', unitPrice: 50000, availableQuantity: 100, discountPercentage: 0, discountedPrice: 50000 },
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
    expect(screen.getAllByText("50'000₮")).toHaveLength(2); // Original price and discounted price
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

  describe('Discount functionality', () => {
    beforeEach(() => {
      // Mock current date to 2024-01-01
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('displays discount badge when ticket has discount', () => {
      render(<EventCard item={mockEvent} />);
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('shows discounted price and original price', () => {
      render(<EventCard item={mockEvent} />);
      expect(screen.getByText("40'000₮")).toBeInTheDocument(); // Discounted price (20% off 50,000)
      expect(screen.getByText("50'000₮")).toBeInTheDocument(); // Original price with strikethrough
    });

    it('calculates discount from date for future concerts', () => {
      const futureEvent = {
        ...mockEvent,
        date: '2024-03-01', // 60+ days in future
        ticketCategories: [
          { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 50, discountPercentage: 0, discountedPrice: 100000 },
        ],
      };
      render(<EventCard item={futureEvent} />);
      expect(screen.getByText('20%')).toBeInTheDocument(); // Date-based discount
    });

    it('shows no discount for concerts less than 30 days away', () => {
      const nearEvent = {
        ...mockEvent,
        date: '2024-01-15', // Less than 30 days
        ticketCategories: [
          { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 50, discountPercentage: 0, discountedPrice: 100000 },
        ],
      };
      render(<EventCard item={nearEvent} />);
      expect(screen.queryByText('20%')).not.toBeInTheDocument();
      expect(screen.queryByText('10%')).not.toBeInTheDocument();
    });

    it('shows 10% discount for concerts 30-59 days away', () => {
      const midEvent = {
        ...mockEvent,
        date: '2024-02-01', // 31 days in future
        ticketCategories: [
          { id: '1', type: 'VIP', unitPrice: 100000, availableQuantity: 50, discountPercentage: 0, discountedPrice: 100000 },
        ],
      };
      render(<EventCard item={midEvent} />);
      expect(screen.getByText('10%')).toBeInTheDocument();
    });
  });

  it('handles non-array ticket categories', () => {
    const event = { ...mockEvent, ticketCategories: null as unknown as typeof mockEvent.ticketCategories };
    render(<EventCard item={event} />);
    expect(screen.getByText('Test Concert')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
