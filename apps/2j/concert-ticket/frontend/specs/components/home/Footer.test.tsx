import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../src/components/home/Footer';

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />);
    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
  });

  it('renders copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Booking Mongolia/)).toBeInTheDocument();
  });

  it('renders email', () => {
    render(<Footer />);
    expect(screen.getByText('support@ticketbooking.mn')).toBeInTheDocument();
  });

  it('renders phone', () => {
    render(<Footer />);
    expect(screen.getByText('+976 1234-5678')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<Footer className="custom-footer" />);
    expect(container.querySelector('.custom-footer')).toBeInTheDocument();
  });
});
