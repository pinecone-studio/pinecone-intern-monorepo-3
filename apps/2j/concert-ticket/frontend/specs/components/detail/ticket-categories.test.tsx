import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCategories } from '../../../src/components/detail/ticket-categories';

describe('TicketCategories', () => {
  const mockOnBookTicket = jest.fn();
  const mockTicketCategories = [
    {
      id: '1',
      name: 'VIP тасалбар',
      price: 150000,
      available: 50,
      color: '#4651c9',
    },
    {
      id: '2',
      name: 'Энгийн тасалбар',
      price: 100000,
      available: 100,
      color: '#c772c4',
    },
  ];

  beforeEach(() => {
    mockOnBookTicket.mockClear();
  });

  it('should render all ticket categories', () => {
    render(<TicketCategories ticketCategories={mockTicketCategories} onBookTicket={mockOnBookTicket} />);

    expect(screen.getByText('VIP тасалбар')).toBeInTheDocument();
    expect(screen.getByText('(50 ширхэг)')).toBeInTheDocument();
    expect(screen.getByText('150,000₮')).toBeInTheDocument();

    expect(screen.getByText('Энгийн тасалбар')).toBeInTheDocument();
    expect(screen.getByText('(100 ширхэг)')).toBeInTheDocument();
    expect(screen.getByText('100,000₮')).toBeInTheDocument();
  });

  it('should call onBookTicket when button is clicked', () => {
    render(<TicketCategories ticketCategories={mockTicketCategories} onBookTicket={mockOnBookTicket} />);

    const bookButtons = screen.getAllByText('Тасалбар захиалах');
    fireEvent.click(bookButtons[0]);

    expect(mockOnBookTicket).toHaveBeenCalledTimes(1);
  });
});
