import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConcertDetails } from '../../../src/components/detail/concert-details';

const mockProps = {
  eventDate: '2024.11.15 - 11.18',
  eventTime: '19:00',
  venue: 'UG ARENA',
  specialArtists: ['ХАР ТАС', 'Mr.DoggS'],
  schedule: {
    doorOpen: '6pm',
    musicStart: '22pm',
  },
  ticketCategories: [
    {
      id: '1',
      name: 'Арын тасалбар',
      price: 89000,
      available: 123,
      color: '#000000',
    },
    {
      id: '2',
      name: 'VIP тасалбар',
      price: 129000,
      available: 38,
      color: '#3B82F6',
    },
    {
      id: '3',
      name: 'Энгийн тасалбар',
      price: 159000,
      available: 38,
      color: '#A855F7',
    },
  ],
  onBookTicket: jest.fn(),
};

describe('ConcertDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render concert details with all sections', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByTestId('concert-details')).toBeInTheDocument();
    expect(screen.getAllByText('2024.11.15 - 11.18')).toHaveLength(2);
    expect(screen.getAllByText('19:00')).toHaveLength(2);
    expect(screen.getAllByText('UG ARENA')).toHaveLength(5); // Main venue + 3 related events
  });

  it('should render special artists correctly', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Special Artist')).toBeInTheDocument();
    expect(screen.getByText('ХАР ТАС')).toBeInTheDocument();
    expect(screen.getByText('Mr.DoggS')).toBeInTheDocument();
  });

  it('should render concert schedule', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Тоглолтийн цагийн хуваарь:')).toBeInTheDocument();
    expect(screen.getByText('Door open: 6pm')).toBeInTheDocument();
    expect(screen.getByText('Music start: 22pm')).toBeInTheDocument();
  });

  it('should render related events section', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Холбоотой эвент болон тоглолтууд')).toBeInTheDocument();
    expect(screen.getByText('Music of the Spheres')).toBeInTheDocument();
    expect(screen.getByText('Summer Festival')).toBeInTheDocument();
    expect(screen.getByText('Rock Night')).toBeInTheDocument();
  });

  it('should render discount badges for events with discounts', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getAllByText('20%')).toHaveLength(2); // Two events have 20% discount
  });

  it('should render stage plan section', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Stage plan:')).toBeInTheDocument();
  });

  it('should handle book ticket button click from ticket categories', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    render(<ConcertDetails {...mockProps} />);

    const bookButtons = screen.getAllByText('Тасалбар захиалах');
    fireEvent.click(bookButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/cart');
  });

  it('should handle main book ticket button click', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    render(<ConcertDetails {...mockProps} />);

    const mainBookButton = screen.getByTestId('book-ticket-button');
    fireEvent.click(mainBookButton);

    expect(mockPush).toHaveBeenCalledWith('/cart');
  });

  it('should render venue selection dropdown', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Тоглолт үзэх өдрөө сонгоно уу.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Өдөр сонгох')).toBeInTheDocument();
  });

  it('should render Related Events section', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Холбоотой эвент болон тоглолтууд')).toBeInTheDocument();
    expect(screen.getByText('Music of the Spheres')).toBeInTheDocument();
    expect(screen.getByText('coldplay')).toBeInTheDocument();
    expect(screen.getByText('Summer Festival')).toBeInTheDocument();
    expect(screen.getByText('Rock Night')).toBeInTheDocument();
  });

  it('should display discount badges for events that have them', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getAllByText('20%')).toHaveLength(2); // Two events have 20% discount
  });
});
