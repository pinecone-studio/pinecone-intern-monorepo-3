import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RelatedConcerts } from '@/components/detail/related-concerts';
import { useHomeEventsQuery } from '@/generated';

jest.mock('@/generated', () => ({
  ...jest.requireActual('@/generated'),
  useHomeEventsQuery: jest.fn(),
  TicketType: {
    Vip: 'VIP',
    Regular: 'REGULAR',
    GeneralAdmission: 'GENERAL_ADMISSION',
  },
}));

const mockConcerts = [
  {
    id: '1',
    name: 'Concert 1',
    image: 'image1.jpg',
    mainArtist: { name: 'Artist 1' },
    venue: 'Venue 1',
    date: '2024-12-01',
    time: '20:00',
    ticketCategories: [{ unitPrice: 10000 }, { unitPrice: 20000 }],
  },
  {
    id: '2',
    name: 'Concert 2',
    image: 'image2.jpg',
    mainArtist: { name: 'Artist 2' },
    venue: 'Venue 2',
    date: '2024-12-05',
    time: '19:00',
    ticketCategories: [{ unitPrice: 15000 }],
  },
  {
    id: '3',
    name: 'Concert 3',
    image: null,
    mainArtist: null,
    venue: 'Venue 3',
    date: '2024-12-10',
    time: '21:00',
    ticketCategories: [],
  },
];

describe('RelatedConcerts', () => {
  it('renders nothing while loading', () => {
    (useHomeEventsQuery as jest.Mock).mockReturnValue({ loading: true });
    const { container } = render(<RelatedConcerts excludeConcertId="4" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing on error', () => {
    (useHomeEventsQuery as jest.Mock).mockReturnValue({ error: new Error('test error') });
    const { container } = render(<RelatedConcerts excludeConcertId="4" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders related concerts and excludes the current one', () => {
    (useHomeEventsQuery as jest.Mock).mockReturnValue({
      data: { concerts: { concerts: mockConcerts } },
      loading: false,
      error: null,
    });
    render(<RelatedConcerts excludeConcertId="1" />);
    expect(screen.getByText('Concert 2')).toBeInTheDocument();
    expect(screen.getAllByText('Concert 3').length).toBeGreaterThan(0);
    expect(screen.queryByText('Concert 1')).not.toBeInTheDocument();
  });

  it('renders correct price and date formatting', () => {
    (useHomeEventsQuery as jest.Mock).mockReturnValue({
      data: { concerts: { concerts: mockConcerts } },
      loading: false,
      error: null,
    });
    render(<RelatedConcerts excludeConcertId="4" />);
    expect(screen.getByText('10,000₮')).toBeInTheDocument();
    expect(screen.getByText('12.01')).toBeInTheDocument();
  });
});
