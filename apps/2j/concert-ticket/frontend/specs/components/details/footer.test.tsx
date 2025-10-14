import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../../src/components/detail/footer';

describe('Footer Component', () => {
  it('Should render all footer elements', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-logo')).toBeInTheDocument();
    expect(screen.getByText('TICKET BOOKING')).toBeInTheDocument();

    expect(screen.getByTestId('footer-copyright')).toBeInTheDocument();
    expect(screen.getByText('© 2024 Booking Mongolia. All Rights Reserved.')).toBeInTheDocument();

    expect(screen.getByTestId('contact-header')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();

    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByText('support@ticketinbooking.mn')).toBeInTheDocument();

    expect(screen.getByTestId('phone')).toBeInTheDocument();
    expect(screen.getByText('+976 (11) 123-4567')).toBeInTheDocument();

    expect(screen.getByTestId('support')).toBeInTheDocument();
    expect(screen.getByText('Available 24/7')).toBeInTheDocument();
  });

  it('Should have correct CSS classes', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toHaveClass('px-6', 'py-8', 'text-white', 'bg-black');

    expect(screen.getByTestId('footer-logo')).toHaveClass('flex', 'items-center', 'gap-2', 'mb-2');
    expect(screen.getByTestId('footer-copyright')).toHaveClass('text-sm', 'text-gray-400');

    expect(screen.getByTestId('contact-header')).toHaveClass('mb-2', 'text-sm', 'font-medium', 'text-gray-500');
  });

  it('Should render contact information with icons', () => {
    render(<Footer />);

    const emailSection = screen.getByTestId('email');
    const phoneSection = screen.getByTestId('phone');
    const supportSection = screen.getByTestId('support');

    expect(emailSection).toBeInTheDocument();
    expect(phoneSection).toBeInTheDocument();
    expect(supportSection).toBeInTheDocument();

    expect(emailSection).toHaveTextContent('Email:');
    expect(phoneSection).toHaveTextContent('Phone:');
    expect(supportSection).toHaveTextContent('Customer Support:');
  });
});
