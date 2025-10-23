import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../../src/components/detail/footer';

describe('Footer', () => {
  it('footer-ийн агуулгыг зөв харуулна', () => {
    render(<Footer />);

    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Booking Mongolia. All Rights Reserved.')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('холбоо барих мэдээллийг зөв харуулна', () => {
    render(<Footer />);

    expect(screen.getByText('support@ticketinbooking.mn')).toBeInTheDocument();
    expect(screen.getByText('+976 (11) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Available 24/7')).toBeInTheDocument();
  });

  it('testid-ууд зөв байна', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
    expect(screen.getByTestId('footer-copyright')).toBeInTheDocument();
    expect(screen.getByTestId('contact-header')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('phone')).toBeInTheDocument();
    expect(screen.getByTestId('support')).toBeInTheDocument();
  });
});
