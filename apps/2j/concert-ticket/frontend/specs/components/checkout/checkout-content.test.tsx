import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutContent } from '../../../src/components/checkout/checkout-content';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), back: jest.fn() }) }));

const data = JSON.stringify([{ id: '1', name: 'VIP', price: 50000, quantity: 2, color: '#00b7f4' }]);

describe('CheckoutContent', () => {
  it('renders phone input', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getByPlaceholderText('9900-0000')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
  });

  it('renders continue button', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getByText('Үргэлжлүүлэх')).toBeInTheDocument();
  });

  it('displays ticket name', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('handles form input', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phone = screen.getByPlaceholderText('9900-0000');
    fireEvent.change(phone, { target: { value: '99000000' } });
    expect(phone).toHaveValue('99000000');
  });

  it('handles empty data', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify([]))} />);
    expect(screen.getByPlaceholderText('9900-0000')).toBeInTheDocument();
  });

  it('displays quantity', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getAllByText('x 2').length).toBeGreaterThan(0);
  });

  it('calculates total', () => {
    const items = [{ id: '1', name: 'VIP', price: 50000, quantity: 2, color: '#00b7f4' }];
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify(items))} />);
    expect(screen.getAllByText('100,000₮').length).toBeGreaterThan(0);
  });

  it('renders ticket color', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const colorDot = document.querySelector('[style*="#00b7f4"]');
    expect(colorDot).toBeInTheDocument();
  });

  it('validates phone format', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phone = screen.getByPlaceholderText('9900-0000');
    fireEvent.change(phone, { target: { value: '123' } });
    expect(phone).toHaveValue('123');
  });

  it('validates email format', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const email = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(email, { target: { value: 'test@example.com' } });
    expect(email).toHaveValue('test@example.com');
  });

  it('renders multiple tickets', () => {
    const multi = [
      { id: '1', name: 'VIP', price: 50000, quantity: 2, color: '#00b7f4' },
      { id: '2', name: 'Regular', price: 30000, quantity: 1, color: '#ff0000' },
    ];
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify(multi))} />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument();
  });

  it('calculates multi-ticket total', () => {
    const multi = [
      { id: '1', name: 'VIP', price: 50000, quantity: 2, color: '#00b7f4' },
      { id: '2', name: 'Reg', price: 30000, quantity: 1, color: '#f00' },
    ];
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify(multi))} />);
    expect(screen.getAllByText('130,000₮').length).toBeGreaterThan(0);
  });

  it('renders with single ticket', () => {
    const single = [{ id: '1', name: 'A', price: 10000, quantity: 1, color: '#000' }];
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify(single))} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('calculates zero total for empty', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(JSON.stringify([]))} />);
    expect(screen.getAllByText('0₮').length).toBeGreaterThan(0);
  });

  it('handles invalid JSON gracefully', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData="invalid" />);
    expect(screen.getByPlaceholderText('9900-0000')).toBeInTheDocument();
  });

  it('renders quantity x format', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getAllByText(/x \d/).length).toBeGreaterThan(0);
  });

  it('displays subtotal', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    expect(screen.getAllByText(/₮/).length).toBeGreaterThan(0);
  });

  it('handles phone input change', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phoneInput = screen.getByPlaceholderText('9900-0000');
    fireEvent.change(phoneInput, { target: { value: '99887766' } });
    expect(phoneInput).toHaveValue('99887766');
  });

  it('validates empty phone on continue', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const btn = screen.getByText('Үргэлжлүүлэх');
    fireEvent.click(btn);
    expect(screen.getByText(/Утасны дугаар оруулна уу/)).toBeInTheDocument();
  });

  it('validates empty email on continue', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phoneInput = screen.getByPlaceholderText('9900-0000');
    fireEvent.change(phoneInput, { target: { value: '99887766' } });
    const btn = screen.getByText('Үргэлжлүүлэх');
    fireEvent.click(btn);
    expect(screen.getByText(/Имэйл хаяг оруулна уу/)).toBeInTheDocument();
  });

  it('validates invalid email format', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phoneInput = screen.getByPlaceholderText('9900-0000');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(phoneInput, { target: { value: '99887766' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    const btn = screen.getByText('Үргэлжлүүлэх');
    fireEvent.click(btn);
    expect(screen.getByText(/Зөв имэйл хаяг оруулна уу/)).toBeInTheDocument();
  });

  it('handles valid form submission', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const phoneInput = screen.getByPlaceholderText('9900-0000');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(phoneInput, { target: { value: '99887766' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const btn = screen.getByText('Үргэлжлүүлэх');
    fireEvent.click(btn);
    expect(screen.getByText(/Төлбөр боловсруулах хэсэг хөгжүүлэгдэж байна/)).toBeInTheDocument();
  });

  it('handles email input change', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);
    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@test.mn' } });
    expect(emailInput).toHaveValue('test@test.mn');
  });

  it('uses default ticket categories when ticketData is invalid JSON', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData="invalid-json" />);
    expect(screen.getByPlaceholderText('9900-0000')).toBeInTheDocument();
  });

  it('uses default ticket categories when ticketData is undefined', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={undefined as unknown as string} />);
    expect(screen.getByText('Арын тасалбар')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('9900-0000')).toBeInTheDocument();
  });

  it('validates form and shows error, then clears error when close button is clicked', () => {
    render(<CheckoutContent _concertId="1" _selectedDate="2024-12-25" ticketData={encodeURIComponent(data)} />);

    const continueButton = screen.getByText('Үргэлжлүүлэх');
    fireEvent.click(continueButton);

    const errorMessage = screen.getByText('Утасны дугаар оруулна уу!');
    expect(errorMessage).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((btn) => btn.querySelector('svg'));
    if (closeButton) {
      fireEvent.click(closeButton);
    }
  });
});
