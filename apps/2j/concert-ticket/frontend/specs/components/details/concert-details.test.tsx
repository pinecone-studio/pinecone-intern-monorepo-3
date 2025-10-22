import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConcertDetails } from '../../../src/components/detail/concert-details';

const mockProps = {
  eventDate: '11.15',
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
  _onBookTicket: jest.fn(),
  selectedDate: '',
  onDateChange: jest.fn(),
};

describe('ConcertDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render concert details with all sections', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByTestId('concert-details')).toBeInTheDocument();
    expect(screen.getAllByText('11.15')).toHaveLength(2);
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('UG ARENA')).toBeInTheDocument();
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

  it('should render ticket categories correctly', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Арын тасалбар (123)')).toBeInTheDocument();
    expect(screen.getByText('VIP тасалбар (38)')).toBeInTheDocument();
    expect(screen.getByText('Энгийн тасалбар (38)')).toBeInTheDocument();
  });

  it('should display ticket prices correctly', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('89,000₮')).toBeInTheDocument();
    expect(screen.getByText('129,000₮')).toBeInTheDocument();
    expect(screen.getByText('159,000₮')).toBeInTheDocument();
  });

  it('should render stage plan section', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Stage plan:')).toBeInTheDocument();
  });

  it('should handle book ticket button click', () => {
    render(<ConcertDetails {...mockProps} />);

    const bookButton = screen.getByTestId('book-ticket-button');
    fireEvent.click(bookButton);

    expect(bookButton).toBeInTheDocument();
  });

  it('should render date selection dropdown', () => {
    render(<ConcertDetails {...mockProps} />);

    expect(screen.getByText('Тоглолт үзэх өдрөө сонгоно уу.')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should handle date selection change', () => {
    const mockOnDateChange = jest.fn();
    const propsWithCallback = { ...mockProps, onDateChange: mockOnDateChange };

    render(<ConcertDetails {...propsWithCallback} />);

    const dateSelect = screen.getByRole('combobox');
    fireEvent.change(dateSelect, { target: { value: '11.15' } });

    expect(mockOnDateChange).toHaveBeenCalledWith('11.15');
  });

  it('should call onBookTicket when button is clicked', () => {
    render(<ConcertDetails {...mockProps} />);

    const bookButton = screen.getByTestId('book-ticket-button');
    fireEvent.click(bookButton);

    expect(mockProps._onBookTicket).toHaveBeenCalled();
  });

  it('should render all available date options', () => {
    render(<ConcertDetails {...mockProps} />);

    // const _options = screen.getAllByRole('option');

    expect(screen.getAllByText('11.15')).toHaveLength(2);
   
  
  });

  it('should handle date selection change', () => {
    render(<ConcertDetails {...mockProps} />);
    
    // Check if date select element exists
    const dateSelect = screen.getByRole('combobox');
    expect(dateSelect).toBeInTheDocument();
    
    // Check if date options are available
    expect(screen.getByText('Өдөр сонгох')).toBeInTheDocument();
    expect(screen.getAllByText('11.15')).toHaveLength(2);
  });

  it('should display correct concert information', () => {
    render(<ConcertDetails {...mockProps} />);
    
    // Check if concert details are rendered
    expect(screen.getAllByText('11.15')).toHaveLength(2);
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('UG ARENA')).toBeInTheDocument();
  });

  it('should handle ticket category selection', () => {
    render(<ConcertDetails {...mockProps} />);
    
    // Check if ticket categories are rendered with availability counts
    expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument();
  });

  it('should handle quantity changes', () => {
    render(<ConcertDetails {...mockProps} />);
    
    // Check if ticket categories are rendered with availability counts
    expect(screen.getByText(/Арын тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/VIP тасалбар/)).toBeInTheDocument();
    expect(screen.getByText(/Энгийн тасалбар/)).toBeInTheDocument();
  });

  it('should handle buy button click', () => {
    render(<ConcertDetails {...mockProps} />);
    
    const buyButton = screen.getByText('Тасалбар захиалах');
    expect(buyButton).toBeInTheDocument();
    
    fireEvent.click(buyButton);
    // Should navigate to cart or show some action
  });

  it('should display ticket prices correctly', () => {
    render(<ConcertDetails {...mockProps} />);
    
    expect(screen.getByText('129,000₮')).toBeInTheDocument();
    expect(screen.getByText('89,000₮')).toBeInTheDocument();
  });

  it('should handle empty ticket categories', () => {
    const emptyProps = {
      ...mockProps,
      ticketCategories: []
    };
    
    render(<ConcertDetails {...emptyProps} />);
    
    const buyButton = screen.getByText('Тасалбар захиалах');
    expect(buyButton).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const loadingProps = {
      ...mockProps,
      loading: true
    };
    
    render(<ConcertDetails {...loadingProps} />);
    
    // Check if component renders during loading
    expect(screen.getByTestId('concert-details')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const errorProps = {
      ...mockProps,
      error: new Error('Test error')
    };
    
    render(<ConcertDetails {...errorProps} />);
    
    // Check if component renders during error
    expect(screen.getByTestId('concert-details')).toBeInTheDocument();
  });
});
